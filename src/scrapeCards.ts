import axios from 'axios';
import cheerio from 'cheerio';

async function scrape(){ 
    await axios.get('https://scryfall.com/sets')
    .then(resp => {
        //tbody > tr > td:first-child > a

        const $ = cheerio.load(resp.data);
        $("tbody > tr > td:first-child > a").each(function(_, element){
            const textList = $(element).text().trim().split(' ')
            const setName = textList.slice(0, textList.length - 1).join(' ');
            const setUrl = $(element).attr('href');
        })

        /*
        const $ = cheerio.load(resp.data);

        productObj['more-details'] = {};

        // Get all elements from html list (with info about product)
        $("li[class='clearfix']").each(function (_, e) {
            const key = $(e).find('.details-label').contents().last().text();
            const attrValue = $(e).find('.details-value').text();

            let attrType = 'NoType';
            if(numberKeys.includes(key)) attrType = 'Number'
            else if(boolKeys.includes(key)) attrType = 'Bool'

            const convertedVal = convertProdAttribute(attrValue, attrType);

            if(Array.isArray(convertedVal)){
                productObj['more-details'][key+'_low'] = convertedVal[0];
                productObj['more-details'][key+'_high'] = convertedVal[1];
            }else{
                productObj['more-details'][key] = convertedVal;
            }
        })

        */
    }).catch(function (error) {
        throw error;
    });
}

scrape();