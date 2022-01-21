import 'dotenv/config'
import {createConnection} from 'typeorm'
import express from 'express'
import bodyParser from 'body-parser'

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
            synchronize: true
        });
        console.log('Successfully connected to DB.')
    }catch(error){
        console.log(error);
    }
}

main();