import axios from 'axios';
import cheerio, { Cheerio } from 'cheerio';
import {getSets} from './index';

async function scrapeCardIdsFromSet(setUrl: string) {
    console.log(setUrl);
    return axios.get(setUrl)
    .then(resp => {
        const $ = cheerio.load(resp.data);

        let cardsCategories: string[] = [];
        $('.card-grid-header-content').each((_, element) => {
            const cardsCategory: any = $(element).first().contents().filter(function() {
                return this.type === 'text';
            }).text().trim().split('\n')[0].trim();
            cardsCategories.push(cardsCategory);
        });

        let numberOfCardsPerCategory: number[] = [];
        $('.card-grid-inner').each((_, element) => {
            let i = 0;
            $(element).find('> div > a').each((idx, element) => {
                const src1 = $(element).find('.card-grid-item-card-front > img').attr('src');
                const src2 = $(element).find('.card-grid-item-card-front > img').attr('data-src');
                let src = src1;
                if(!src) src = src2;
                if(src){
                    //console.log(src.match(/\/([^\/]*)\.jpg/));
                    i++;
                }else{
                    //console.log(idx, $(element).find('.card-grid-item-card-front > img').toString());
                }
            });
            console.log(i, $(element).find('> div > a').length, setUrl);
            if(i !== $(element).find('> div > a').length){
                console.log('End');
                process.exit(1);
            }
        });

        return {
            cardsCategories
        };
    })
    .catch(function (error) {
        throw error;
    });
}

getSets()
.then(sets => 
    sets.reduce((obj: string[], set: any) => {
        if(set['card_count'] > 0){
            obj.push(set['scryfall_uri']);
        }

        return obj;
    }, [])
)
.then(async (setUrls) => {
    for(let i = 0; i < setUrls.length; i++){
        console.log(await scrapeCardIdsFromSet(setUrls[i]));
    }
})
.catch(console.log);