import { getDecks } from "../utils/dataExtraction";
import { getConnection, In } from "typeorm";
import { Deck } from "../entities/Deck";

export async function insertAllDecksInTable(){
    getDecks()
    .then(async (decks) => {
        await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Deck)
        .values(decks)
        .orUpdate(['name', 'releasedAt', 'cardCount', 'isDigital', 'iconUrl', 'type', 'url'], 'PK_0afab7e745df7e2b60fc321c4e2')
        .execute();
    })
}