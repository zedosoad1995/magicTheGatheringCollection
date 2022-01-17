const FIRST_YEAR = 1993;

function getWeightByYear(year: number){
    const c = 1.15835;

    return c**(year - FIRST_YEAR);
}

function getWeightsAndYears(){
    const currYear: number = new Date().getFullYear();

    let years = [];
    let weigths = [];
    for (let year = FIRST_YEAR; year <= currYear; year++) {
        weigths.push(getWeightByYear(year));
        years.push(year);
    }

    return {weigths, years}
}

function getRandomFromWeights(obj: any[], weigths: number[]){
    const {dist, total} = weigths.reduce((obj: any, weight: number) => {
        obj['total'] += weight;
        obj['dist'].push(obj['total']);
        return obj;
    }, {total: 0, dist: []});

    const cumDist = dist.map((weight: number) => weight/total);

    const rand = Math.random();
    return obj[cumDist.findIndex((weight: any) => rand < weight)];
}

export function getRandomYear(){
    const {weigths, years} = getWeightsAndYears();

    return getRandomFromWeights(years, weigths)
}