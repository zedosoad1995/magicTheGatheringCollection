import { createConnection, getRepository } from "typeorm";
import { Card } from "../entities/Card";
import { Deck } from "../entities/Deck";
import { Price } from "../entities/Price";
import connectionOptions from "../ormconfig";
import { getRandomInt } from "../utils/utils";

export async function getRandomCard(){
    const connection = await createConnection(connectionOptions);
    const cardRepository = getRepository(Card);

    const numCards: number = await cardRepository.count();

    const cards = await cardRepository.find({
            skip: getRandomInt(0, numCards-1),
            take: 1
        });

    connection.close();

    return cards[0].imageUrl;
}