import axios from 'axios';
import cheerio, {CheerioAPI } from 'cheerio';
import cliProgress from 'cli-progress';
import {selectSpecificKeys} from './utils';

export function getDecks(){
    return axios.get('https://api.scryfall.com/sets')
    .then(resp => {
        const deckKeys = ['code', 'parent_deck_code', 'name', 'released_at', 'deck_type', 'card_count', 'icon_svg_uri', 'scryfall_uri'];
        return resp['data']['data'].map((deck: any) => selectSpecificKeys(deck, deckKeys));
    })
    .catch((error) => {
        throw(error)
    });
}

// TODO: replace type any
// TODO: get card by card id
/*
export async function getCards(deck: any, cardNum: number){
    const cardKeys = ['name', 'layout', 'image_uris png:image_uri', 'type_line', 'oracle_text', 'mana_cost', 'power', 'toughness', 'colors', 'color_identity',
                    'reserved', 'foil', 'nonfoil', 'digital', 'rarity', 'border_color', 'full_art', 'edhrec_rank', 'prices'];
    const cardKeysLight = ['name', 'layout', 'type_line', 'mana_cost', 'power', 'toughness', 'colors', 'rarity'];
    const cardKeysMegaLight = ['name', 'rarity', 'prices'];

    const code: string = deck['code'];


    return await axios.get(`https://api.scryfall.com/cards/${code}/${cardNum}`, {timeout: 1000})
        .then(resp =>  {
            return selectSpecificKeys(resp['data'], cardKeysMegaLight)
        })
        .catch((error) => {
            throw(error);
        });
}
*/

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

        $(element).find('> div > a').each((cardNum, element) => {
            let imgSrc = $(element).find('.card-grid-item-card-front > img').attr('src');
            if(!imgSrc){
                imgSrc = $(element).find('.card-grid-item-card-front > img').attr('data-src');
            }

            if(imgSrc){
                const cardIdFromSrc = imgSrc.match(/\/([^\/]*)\.jpg/);
                if(cardIdFromSrc){
                    cardIds.push(cardIdFromSrc[1]);
                }else{
                    throw new Error(`Image ${imgSrc} unable to match '/\/([^\/]*)\.jpg/'`);
                }
            }else{
                throw new Error(`Unable to find img or src/data-src from scraped element #${cardNum}`);
            }
        });

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
    .catch(function (error) {
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
    .catch((error) => {
        throw(error);
    });
}