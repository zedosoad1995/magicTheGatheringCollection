import {createConnection} from 'typeorm'
import express from 'express'
import bodyParser from 'body-parser'
import { Price } from './entities/Price';
import { Deck } from './entities/Deck';
import { Card } from './entities/Card';
import { insertAllDecksInTable } from './tasks/fillDeckTable';
import { scrapeAllCards } from './utils/dataExtraction';
import { insertCardsInTable } from './tasks/fillCardTable';
import connectionOptions from '../ormconfig';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



async function main(){

    //await app.listen(process.env.PORT || 3000, () => console.log(`App listening on port ${process.env.PORT || 3000}...`));
    const connection = await createConnection(connectionOptions);
    console.log('Successfully connected to DB.');

    await insertAllDecksInTable();
    console.log('decks updated');

    
    await scrapeAllCards(insertCardsInTable);
}

main().catch(err => {
    console.error(err);
});