import { getDecks } from "../utils/dataExtraction";
import { getConnection } from "typeorm";
import { Deck } from "../entities/Deck";

// TODO: put constraint value in file
export async function insertAllDecksInTable(){
    getDecks()
    .then(async (decks) => {
        await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Deck)
        .values(decks)
        .orUpdate(['name', 'releasedAt', 'cardCount', 'isDigital', 'iconUrl', 'type', 'url'], 'UQ_0afab7e745df7e2b60fc321c4e2')
        .execute();
    })
}