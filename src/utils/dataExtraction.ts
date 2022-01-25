import axios from 'axios';
import cheerio, {CheerioAPI } from 'cheerio';
import cliProgress from 'cli-progress';
import {selectSpecificKeys} from './utils';
import axiosRetry from 'axios-retry';
import { insertCardsInTable } from '../tasks/fillCardTable';

axiosRetry(axios, {
    retries: 3,
    retryDelay: (retryCount) => {
        return retryCount * 2000;
    }
});


export function getDecks(){
    return axios.get('https://api.scryfall.com/sets')
    .then(resp => {
        const deckKeys = ['code', 'name', 'released_at', 'deck_type:type', 'card_count', 'icon_svg_uri:iconUrl', 
                        'scryfall_uri:url', 'set_type:type', 'digital:isDigital', 'card_count'];
        return resp['data']['data'].map((deck: any) => selectSpecificKeys(deck, deckKeys, true));
    })
    .catch((error) => {
        console.error(error);
        throw(error);
    });
}

// TODO: replace type any
async function getCard(cardId: string){
    const cardKeys = ['id:uniqueScryfallId', 'name', 'released_at', 'scryfall_uri:url', 'layout', 'image_uris png>large>normal>small:imageUrl', 'mana_cost',
                    'cmc:rawCost', 'type_line:type', 'colors', 'color_identity', 'oracle_text:rulesText', 'artist', 'power', 'toughness', 
                    'reserved:isReserved', 'foil:hasFoil', 'nonfoil:hasNonFoil', 'oversized:isOversized', 'promo:isPromo', 'reprint:isReprint', 
                    'variation:isVariation', 'set', 'collector_number', 'digital:isDigital', 'rarity', 'flavor_text:descriptionText', 'border_color', 
                    'frame', 'security_stamp', 'full_art:isFullArt', 'textless:isTextless','booster:fromBooster', 'story_spotlight:hasStorySpotlight',
                    'prices', 'edhrec_rank', 'loyalty', 'keywords', 'frame_effects'];

    const cardFaceKeys = [ 'name', 'mana_cost', 'type_line:type', 'oracle_text:rulesText', 'colors', 'power', 'toughness', 'artist',
                        'image_uris png>large>normal>small:imageUrl', 'loyalty', 'flavor_text:descriptionText', 'layout', 'cmc:rawCost'];

    return axios.get(`https://api.scryfall.com/cards/${cardId}`)
        .then(resp =>  {
            let cardInfo = selectSpecificKeys(resp['data'], cardKeys, true);
            let cardsInfo = [cardInfo];

            if('card_faces' in resp['data']){
                cardsInfo = [];

                resp['data']['card_faces'].forEach((cardFace: any, idx: number) => {
                    const cardFaceInfo = selectSpecificKeys(cardFace, cardFaceKeys, true);

                    const fullCardFaceInfo = Object.assign(cardInfo, cardFaceInfo);

                    fullCardFaceInfo['cardPartNumber'] = idx + 1;

                    cardsInfo.push({...fullCardFaceInfo});
                });
            }

            return cardsInfo
        })
        .catch((error) => {
            console.log(cardId, error);
            process.exit(1);
        });
}

function getDeckCategories($: CheerioAPI): string[]{
    let deckCategories: string[] = [];
    $('.card-grid-header-content').each((_, element) => {
        const cardsCategory: string = $(element).first().contents().filter(function() {
            return this.type === 'text';
        }).text().trim().split('\n')[0].trim();

        if(cardsCategory) deckCategories.push(cardsCategory);
    });

    if(deckCategories.length === 0) deckCategories.push('None');

    return deckCategories;
}

function getCardIdsObject($: CheerioAPI, deckCategories: string[]): {[k: string]: string[]}{
    let cardIdsObj: {[k: string]: string[]} = {};

    $('.card-grid-inner').each((deckCategoryNum, element) => {
        let cardIds: string[] = [];

        $(element).find('> div.card-grid-item').each((cardNum, element) => {
            const cardId = $(element).attr('data-card-id');
            if(cardId){
                cardIds.push(cardId);
            }else if(!$(element).hasClass('flexbox-spacer')){
                throw new Error(`Unable to find div.data-card-id from scraped element #${cardNum}`);
            }
        })

        cardIdsObj[deckCategories[deckCategoryNum]] = cardIds;
    });

    return cardIdsObj;
}

async function scrapeCardIdsFromDeck(deckUrl: string) {
    return axios.get(deckUrl)
    .then(resp => {
        const $ = cheerio.load(resp.data);

        // gets categories names in the deck
        const deckCategories = getDeckCategories($);

        // Gets ids of cards in deck, by category
        return getCardIdsObject($, deckCategories);
    })
    .catch(error => {
        //process.exit(1);
        throw error;
    });
}

export async function scrapeAllCardIds(){
    return getDecks()
    .then(decks => 
        decks.reduce((obj: {scryfall_uri: string, code: string}[], deck: any) => {
            if(deck['card_count'] > 0) obj.push({scryfall_uri: deck['scryfall_uri'], code: deck['code']});

            return obj;
        }, [])
    )
    .then(async (decks) => {
        // TODO: Use interface, and extend interface of returned obj
        const decksObj: {[k: string]: {[k: string]: string[]}} = {};

        const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        progressBar.start(decks.length, 0);

        for(let i = 0; i < decks.length; i++){
            progressBar.update(i);
            decksObj[decks[i]['code']] = await scrapeCardIdsFromDeck(decks[i]['scryfall_uri']);
        }
        progressBar.stop();

        return decksObj;
    })
    .catch(error => {
        throw(error);
    });
}

class WorkerWaitForFullBatch<T> {
    array: T[];
    batchSize: number;
    functionToProcess: (arr: T[]) => any;
   
    constructor(functionToProcess: (arr: T[]) => any, batchSize: number = 1000) {
        this.array = [];
        this.batchSize = batchSize;
        this.functionToProcess = functionToProcess;
    }
   
    push(vals: T[]){
        for(let i = 0; i < vals.length; i++){
            this.array.push(vals[i]);

            if(this.array.length >= this.batchSize){
                this.doWork(this.array.splice(0, this.batchSize));
            }
        }
    };

    doWork(workArray: T[]){
        this.functionToProcess(workArray);
    }

    finishWork(){
        this.functionToProcess(this.array);
        this.array.length = 0

    }
}

export async function scrapeAllCards(insertCardsInTable?: (arr: any[]) => any, batchSize: number = 1000){
    return getDecks()
    .then(decks =>
        decks.reduce((obj: {scryfall_uri: string, code: string}[], deck: any) => {
            if(deck['cardCount'] > 0) obj.push({scryfall_uri: deck['url'], code: deck['code']});

            return obj;
        }, [])
    )
    .then(async (decks) => {
        // TODO: Use interface, and extend interface of returned obj
        //const decksObj: {[k: string]: {[k: string]: string[]}} = {};

        const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        progressBar.start(decks.length, 0);

        let worker: WorkerWaitForFullBatch<any> = new WorkerWaitForFullBatch(()=>{}, 0);
        if(insertCardsInTable){
            worker = new WorkerWaitForFullBatch(insertCardsInTable, batchSize);
        }

        let cards: any[] = [];

        for(let i = 0; i < decks.length; i++){
            progressBar.update(i);
            const cardIdsObj = await scrapeCardIdsFromDeck(decks[i]['scryfall_uri']);

            let cardsIdsArray: string[] = [];
            cardsIdsArray = cardsIdsArray.concat(...Object.values(cardIdsObj));

            // TODO: make object that is activated when its inside has >= batch size
            await cardsIdsArray.forEach(async (id) => {
                const returnedCard = await getCard(id);
                cards = cards.concat(...returnedCard);

                if(insertCardsInTable) worker.push(returnedCard);
            });
        }
        if(insertCardsInTable) worker.finishWork();
        progressBar.stop();

        return cards;
    })
    .catch((error) => {
        //console.log(error);
        //process.exit();
        throw(error);
    });
}