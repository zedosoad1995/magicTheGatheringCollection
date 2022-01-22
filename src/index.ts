import 'dotenv/config'
import {createConnection} from 'typeorm'
import express from 'express'
import bodyParser from 'body-parser'
import { Price } from './entities/Price';
import { Deck } from './entities/Deck';
import { Card } from './entities/Card';
import { insertAllDecksInTable } from './tasks/fillDecksTable';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



async function main(){

    //await app.listen(process.env.PORT || 3000, () => console.log(`App listening on port ${process.env.PORT || 3000}...`));
    try{
        const connection = await createConnection({
            type: 'postgres',
            host: process.env.DB_HOST,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [Deck, Card, Price],
            synchronize: true
        });
        console.log('Successfully connected to DB.')

        insertAllDecksInTable();
    }catch(error){
        console.log(error);
    }
}

main();