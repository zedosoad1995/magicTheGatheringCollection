import {createLogger, format, transports, Logger} from 'winston';
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
});

const logFormatCardId = printf(({ message }) => {
    return `${message}`;
});

export class ScrapingLogger {

    static #logger: Logger = createLogger({
        format: combine(
            timestamp(),
            logFormat
          ),
        transports: [
            new transports.File({ filename: './logger/loggingData/scraping.log' }),
        ],
    });;
    static #newCardsLogger: Logger = createLogger({
        format: logFormatCardId,
        transports: [
            new transports.File({ filename: './logger/loggingData/newCards/newCards.log' }),
        ],
    });;
    static #startTime: number = 0;
    static #endTime: number = 0;
    static #numCards: number = 0;
    static #numNewCards: number = 0;

    constructor(){
    }

    static info(str: string){
        this.#logger.info(str);
    }

    static error(str: string){
        this.#logger.error(str);
    }
    
    static begin(){
        this.#startTime = Date.now();
        this.#logger.info('Start scraping all cards.');
    }

    static incrementCardCounter(){
        this.#numCards++;
    }

    static addNewCard(id: number){
        this.#numNewCards++;
        this.#newCardsLogger.info(id);
    }

    static end(){
        this.#endTime = Date.now();
        this.#logger.info(`Scraping finished. Duration: ${this.#endTime - this.#startTime} ms`);
        this.#logger.info(`Total Cards Scraped: ${this.#numCards}, New Cards Added: ${this.#numNewCards} to filepath: './logger/loggingData/newCards/newCards.log'`);
    }

    static get getNumCardsScraped(){
        return this.#numCards;
    }
}