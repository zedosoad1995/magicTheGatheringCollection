import axios from 'axios';
import cheerio, { Cheerio } from 'cheerio';
import {getSets} from './index';

async function scrapeCardIdsFromSet(setUrl: string) {
    return axios.get(setUrl)
    .then(resp => {
        let cardsObj: {[k: string]: string[]} = {};

        const $ = cheerio.load(resp.data);

        // gets categories names in the deck
        let cardsCategories: string[] = [];
        $('.card-grid-header-content').each((_, element) => {
            const cardsCategory: string = $(element).first().contents().filter(function() {
                return this.type === 'text';
            }).text().trim().split('\n')[0].trim();

            if(cardsCategory) cardsCategories.push(cardsCategory);
        });

        if(cardsCategories.length === 0) cardsCategories.push('None');

        // Gets ids of cards in set, by category
        $('.card-grid-inner').each((categoryNum, element) => {
            let cardIds: string[] = [];

            $(element).find('> div > a').each((idx, element) => {
                let src = $(element).find('.card-grid-item-card-front > img').attr('src');
                if(!src){
                    src = $(element).find('.card-grid-item-card-front > img').attr('data-src');
                }

                if(src){
                    const srcMatch = src.match(/\/([^\/]*)\.jpg/);
                    if(srcMatch){
                        cardIds.push(srcMatch[1]);
                    }else{
                        throw new Error(`Image ${src} unable to match '/\/([^\/]*)\.jpg/'`);
                    }
                }else{
                    throw new Error(`Unable to find img or src/data-src from scraped element #${idx}`);
                }
            });

            cardsObj[cardsCategories[categoryNum]] = cardIds;
        });

        return cardsObj;
    })
    .catch(function (error) {
        throw error;
    });
}

getSets()
.then(sets => 
    sets.reduce((obj: {scryfall_uri: string, code: string}[], set: any) => {
        if(set['card_count'] > 0) obj.push({scryfall_uri: set['scryfall_uri'], code: set['code']});

        return obj;
    }, [])
)
.then(async (sets) => {
    // TODO: Use interface, and extend interface of returned obj
    const setsObj: {[k: string]: {[k: string]: string[]}} = {};

    for(let i = 0; i < sets.length; i++){
        setsObj[sets[i]['code']] = await scrapeCardIdsFromSet(sets[i]['scryfall_uri']);
        console.log(setsObj);
    }

    return setsObj;
})
.catch(console.log);