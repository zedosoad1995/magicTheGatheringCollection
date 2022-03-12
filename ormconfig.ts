import 'dotenv/config'
import { ConnectionOptions } from 'typeorm';
import { Card } from './entities/Card';
import { Deck } from './entities/Deck';
import { Price } from './entities/Price';

const connectionOptions: ConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [Deck, Card, Price],
    port: Number(process.env.DB_PORT),
    synchronize: false,
    migrations: [`./migration/*.ts`],
    cli: {
        migrationsDir: "./migration"
    }
}

export = connectionOptions;