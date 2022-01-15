import axios from 'axios';

function selectSpecificKeys(obj: any, keys: string[]): {[k: string]: any}{
    let result: {[k: string]: string} = {};
    keys.forEach(key => {
        if(!(key in obj))
            return;

        const keyAndAlias = key.split(':');
        const multiKeys = keyAndAlias[0].split(' ');

        let val = obj;
        multiKeys.forEach(key => {
            val = val[key];
        })

        if(keyAndAlias && keyAndAlias.length > 1)
            key = keyAndAlias[1];
        
        result[key] = val;
    });
    return result;
}

function getSets(){
    return axios.get('https://api.scryfall.com/sets')
    .then(resp => {
        return resp['data']['data'].map((set: any) => selectSpecificKeys(set, ['code', 'parent_set_code', 'name', 'released_at', 'set_type', 'card_count', 'icon_svg_uri']));
    })
    .catch((error: any) => {
        //throw(error)
    });
}

const specialCodes: Record<string, string[]> = {
    plg21: ['J1', 'J2', 'J3'],
    pjjt: ['1N03', '1N04', '2N04', '1N05', '2N05', '1N06', '2N06', '1N07', '2N07', '1N08', '2N08', '3N08'],
    hho: ['7†', '13†'],
}

/*
pxln: ['END with p or s'],
amh2: ['END with s']
*/

async function getCards(set: any, cardNum?: number){
    const cardKeys = ['name', 'layout', 'image_uris png:image_uri', 'type_line', 'oracle_text', 'mana_cost', 'power', 'toughness', 'colors', 'color_identity',
                    'reserved', 'foil', 'nonfoil', 'digital', 'rarity', 'border_color', 'full_art', 'edhrec_rank', 'prices'];
    const cardKeysLight = ['name', 'layout', 'type_line', 'mana_cost', 'power', 'toughness', 'colors', 'rarity'];
    const cardKeysMegaLight = ['name', 'rarity', 'prices'];

    const deckSize: number = set['card_count'];
    const code: string = set['code'];

    let cards = [];

    if(cardNum){

        return await axios.get(`https://api.scryfall.com/cards/${code}/${cardNum}`, {timeout: 300})
            .then(resp =>  {
                return selectSpecificKeys(resp['data'], cardKeysMegaLight)
            })
            .catch((error) => {
                throw(error);
            });
    }

    for(let i = 1; i <= deckSize; i++){
        let valid = true;

        const card = await axios.get(`https://api.scryfall.com/cards/${code}/${i}`)
        .then(resp =>  selectSpecificKeys(resp['data'], cardKeysMegaLight))
        .catch(() => {
            valid = false
        });
        if(!valid) return cards;

        cards.push(card);
    }

    return cards;
}



function getProbabilityByYear(year: number){
    const currYear: number = new Date().getFullYear();
    const FIRST_YEAR = 1993;

    if(year < FIRST_YEAR || year > currYear) return 0;

    let tempNumerator = 1;
    let numerator = 0;
    let c = 1.15835;

    let total = 0;
    for(let i = FIRST_YEAR; i <= currYear; i++){
        if(i === year) numerator = tempNumerator;

        total += tempNumerator;
        tempNumerator *= c;
    }

    return numerator/total;
}

function getCumDistribution(){
    const FIRST_YEAR = 1993;
    const currYear: number = new Date().getFullYear();

    let cumDistAndYear: {prob: number, year: number}[] = [];
    let sum = 0;
    for(let y = FIRST_YEAR; y < currYear; y++){
        sum += getProbabilityByYear(y);
        cumDistAndYear.push({prob: sum, year: y});
    }
    cumDistAndYear.push({prob: 1, year: currYear});

    return cumDistAndYear;
}

function getRandomYear(){
    const rand = Math.random();
    const cumDistAndYear = getCumDistribution();

    const chosenElement = cumDistAndYear.find((dict: any) => rand < dict['prob']);

    if(chosenElement === undefined) throw new Error(`Cannot retrieve year.`);

    return chosenElement['year'];
}

function selectRandomFromProbDist(obj: any[], weigths: number[]){
    const {dist, total} = weigths.reduce((obj: any, weight: number) => {
        obj['total'] += weight;
        obj['dist'].push(obj['total']);
        return obj;
    }, {total: 0, dist: []});

    const cumDist = dist.map((weight: number) => weight/total);

    const rand = Math.random();
    return obj[cumDist.findIndex((weight: any) => rand < weight)];
}

const currYear: number = new Date().getFullYear();
const FIRST_YEAR = 1993;

getSets()
.then(async (sets) => {
    return sets.reduce((obj: any, set: any) => {
        if('parent_set_code' in set) return obj;

        const year = Number(set['released_at'].slice(0, 4));

        if(isNaN(year)) return obj;

        if(year >= FIRST_YEAR && year <= currYear){
            if(!obj[year]){
                obj[year] = [];
            }
            obj[year].push(set);
        }
        return obj;
    }, {});
    
    //if(year < FIRST_YEAR || year > currYear)

    //sets.
    /*await sets.forEach(async (set: any, i: number) => {
        if('parent_set_code' in set) return;

        return await getCardsBySet(set)
        .then(cards => console.log(set['code'], set['released_at'], cards.length))
        .catch(() => console.log('Invalid set:', set['code']));
    });*/
})
.then(async (setsByYear) => {
    let setOfMostExpensiveCard: any = {};
    let mostExpensiveCard: any = {};
    let highestPrice = -1;

    for(let i = 0; i < 1000; i++) {
        console.log(i);
        const year = getRandomYear();
        const selectedSets = setsByYear[year];

        const cardCounts = selectedSets.map((set: any) => set['card_count']);

        const selectedSet = selectRandomFromProbDist(selectedSets, cardCounts);

        const randCardNum = Math.floor(Math.random() * selectedSet['card_count']);
        if(!randCardNum) continue;

        await getCards(selectedSet, randCardNum)
        .then((card: any) => {
            const price = Number(card['prices']['usd']);
            if(price > highestPrice){
                setOfMostExpensiveCard = selectedSet;
                mostExpensiveCard = card;
                highestPrice = price;
            }
            console.log(selectedSet['card_count'], selectedSet['released_at'], card)
        })
        .catch(() => console.log('Invalid Card'));
    }

    console.log('Most expensive card:', mostExpensiveCard, setOfMostExpensiveCard);

});