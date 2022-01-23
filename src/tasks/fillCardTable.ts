import { getDecks, scrapeAllCards } from "../utils/dataExtraction";
import { getConnection } from "typeorm";
import { Deck } from "../entities/Deck";
import { Card } from "../entities/Card";
import { Price } from "../entities/Price";

import _ from 'lodash';

function stringToNumber(str: string|null){
    return (!str) ? null : parseFloat(str);
}

// TODO: put constraint value in file
export async function insertCardsInTable(cards: any){
    for(let i = 0; i < cards.length; i++){
        let priceEntity = new Price();
        const prices = cards[i]['prices'];

        const pricesCorrectedName = {usdFoil: prices['usd_foil'], eurFoil: prices['eur_foil'], usdEtched: prices['usd_etched'],
                            usd: prices['usd'], eur: prices['eur'], tix: prices['tix']};
        const pricesToInsert = Object.fromEntries(
            Object.entries(pricesCorrectedName).map(([key, value]) => [key, stringToNumber(value)])
        );
        
        Object.assign(priceEntity, pricesToInsert);

        let card = Card.create(_.omit(cards[i], 'prices'));
        card.price = priceEntity;

        const cardPart = ('cardPartNumber' in card) ? card['cardPartNumber'] : null;
        const foundCard = await getConnection().manager.find(Card, {where: {uniqueScryfallId: card['uniqueScryfallId'], cardPartNumber: cardPart}})
        .then(cards => cards[0]);

        const foundDeck = await getConnection().manager.find(Deck, {where: {code: cards[i]['set']}})
        .then(decks => decks[0]);

        card['deck'] = foundDeck;
        if(!foundDeck){
            console.log(cards[i]['set']);
            process.exit(1);
        };

        if(foundCard){
            Object.assign(foundCard, _.omit(card, 'price'));

            const foundPrice = foundCard.price;
            Object.assign(foundPrice, card['price']);

            await getConnection().manager.save(foundCard);
            await getConnection().manager.save(foundPrice);
        }else{
            await getConnection().manager.save(card);
        }
    }
}