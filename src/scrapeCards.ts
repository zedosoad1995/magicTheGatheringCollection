import axios from 'axios';
import cheerio from 'cheerio';
import { setOriginalNode } from 'typescript';
import {getSets} from './index';

interface ScrapedSets{
    name: string,
    code: string,
    url: string
}

async function scrapeSets(){ 
    return axios.get('https://scryfall.com/sets')
    .then(resp => {
        const $ = cheerio.load(resp.data);
        let sets: ScrapedSets[] = [];

        $("tbody > tr > td:first-child > a").each((_, element) => {
            const textList = $(element).text().trim().split(' ')

            if(textList.length < 2) throw new Error(`Scraped string ${$(element).text().trim()} is missing 1 or more parameters. 
                                                    They should be 'setName' and 'setCode'.`);

            const setName = textList.slice(0, textList.length - 1).join(' ');
            const setCode = textList[textList.length - 1];
            const setUrl = $(element).attr('href');

            if(!setUrl) throw new Error(`Unable to scrape URL from set ${setName}`);

            // Only codes smaller or equal to size 5 are valid. The other are just unofficial ones.
            //if(setCode.length <= 5) 
            sets.push({name: setName, code: setCode, url: setUrl});
        })

        return sets;
    })
    .catch(function (error) {
        throw error;
    });
}

async function scrapeCardIdsFromSet(setUrl: string) {
    return axios.get(setUrl + '?as=checklist')
    .then(resp => {
        const $ = cheerio.load(resp.data);
        let ids: string[] = []

        $('tr[data-component="card-tooltip"]').each(function(i, element){
            const cardId = $(element).attr('data-card-id');

            if(!cardId) throw new Error(`No card Id found for set URL: ${setUrl}, on the element #${i}`);
            ids.push(cardId);
        })

        return ids;
    }).catch(function (error) {
        throw error;
    });
}

/*
scrapeSets()
.then(sets => {
    return scrapeCardIdsFromSet(sets[0]['url'])
})
.then(console.log);
*/

function getUniqueElementsFromEachSide(arr1: string[], arr2: string[]){
    let i = 0;
    while(i < arr1.length){
        if(arr2.includes(arr1[i])){
            const idxArr2ToDelete = arr2.findIndex(val => val === arr1[i]);
            arr2.splice(idxArr2ToDelete, 1);
            arr1.splice(i, 1);
            i--;
        }
        i++;
    }
}

async function checkNonOverlapingSets(){
    const setNamesAPI = await getSets().then(sets => sets.map((set: any) => set['code']));
    const setNamesScraping = await scrapeSets().then(sets => sets.map((set: any) => set['code'].toLowerCase()));
    console.log(setNamesAPI, setNamesScraping);
    getUniqueElementsFromEachSide(setNamesAPI, setNamesScraping);
    console.log(setNamesAPI, setNamesScraping);
}

checkNonOverlapingSets();