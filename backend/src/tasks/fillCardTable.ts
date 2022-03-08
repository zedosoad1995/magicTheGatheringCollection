import { getConnection } from "typeorm";
import { Deck } from "../entities/Deck";
import { Card } from "../entities/Card";
import { Price } from "../entities/Price";
import { ScrapingLogger } from '../logger';

import _ from 'lodash';

function stringToNumber(str: string|null){
    return (!str) ? null : parseFloat(str);
}

function getNewPriceEntity(card: any){
    let priceEntity = new Price();
    const prices = card['prices'];

    const pricesCorrectedName = {usdFoil: prices['usd_foil'], eurFoil: prices['eur_foil'], usdEtched: prices['usd_etched'],
                    usd: prices['usd'], eur: prices['eur'], tix: prices['tix']};
    const pricesToInsert = Object.fromEntries(
        Object.entries(pricesCorrectedName).map(([key, value]) => [key, stringToNumber(value)])
    );
    Object.assign(priceEntity, pricesToInsert);

    return priceEntity;
}

// TODO: put constraint value in file
export async function insertCardsInTable(cards: any){
    for(const card of cards){
        const cardPart = ('cardPartNumber' in card) ? card['cardPartNumber'] : null;

        const existingCards = await getConnection().manager
        .find(Card, {where: {uniqueScryfallId: card['uniqueScryfallId']}});

        const otherCardParts = existingCards.filter(card => card.cardPartNumber !== cardPart);
        const currCardParts = existingCards.filter(card => card.cardPartNumber === cardPart);

        const cardExists = currCardParts.length > 0;
        const containsOtherParts = otherCardParts.length > 0;

        if(!cardExists){
            const cardEntity = Card.create(_.omit(card, 'prices'));

            cardEntity['price'] = containsOtherParts ? otherCardParts[0]['price'] : getNewPriceEntity(card);

            const foundDeck = await getConnection().manager
            .find(Deck, {where: {code: card['set']}})
            .then(decks => decks[0]);

            if(!foundDeck){
                throw new Error(`Card set '${card['set']}' not found`);
            };
            cardEntity['deck'] = foundDeck;

            const savedCard = await getConnection().manager.save(cardEntity);

            ScrapingLogger.addNewCard(savedCard['id']);

        }else{
            const cardEntity = currCardParts[0];
            Object.assign(cardEntity, _.omit(card, 'price'));

            Object.assign(cardEntity['price'], card['price']);

            await getConnection().manager.save(cardEntity);
        }

        ScrapingLogger.incrementCardCounter();
    }
}