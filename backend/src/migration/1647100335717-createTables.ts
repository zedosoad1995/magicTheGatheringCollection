import {MigrationInterface, QueryRunner} from "typeorm";

export class createTables1647100335717 implements MigrationInterface {
    name = 'createTables1647100335717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "deck" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "name" character varying NOT NULL, "releasedAt" date NOT NULL, "cardCount" integer NOT NULL, "isDigital" boolean, "url" character varying NOT NULL, "iconUrl" character varying NOT NULL, "type" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_CODE" UNIQUE ("code"), CONSTRAINT "PK_99f8010303acab0edf8e1df24f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "price" ("id" SERIAL NOT NULL, "usd" double precision, "usdFoil" double precision, "usdEtched" double precision, "eur" double precision, "eurFoil" double precision, "tix" double precision, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_d163e55e8cce6908b2e0f27cea4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "card" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "releasedAt" date NOT NULL, "url" character varying NOT NULL, "layout" character varying, "type" character varying NOT NULL, "colors" text array NOT NULL, "imageUrl" character varying, "manaCost" character varying, "rawCost" double precision, "rulesText" character varying, "descriptionText" character varying, "power" character varying, "toughness" character varying, "keywords" text array, "isReserved" boolean NOT NULL, "hasFoil" boolean NOT NULL, "hasNonFoil" boolean NOT NULL, "isOversized" boolean NOT NULL, "isPromo" boolean NOT NULL, "isReprint" boolean NOT NULL, "isVariation" boolean NOT NULL, "collectorNumber" character varying, "isDigital" boolean NOT NULL, "rarity" character varying NOT NULL, "artist" character varying, "borderColor" character varying NOT NULL, "frame" character varying NOT NULL, "frameEffects" character varying, "securityStamp" character varying, "loyalty" character varying, "isFullArt" boolean NOT NULL, "isTextless" boolean NOT NULL, "fromBooster" boolean NOT NULL, "hasStorySpotlight" boolean, "edhrecRank" integer, "uniqueScryfallId" uuid NOT NULL, "cardPartNumber" integer, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deckId" integer, "priceId" integer NOT NULL, CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_673081effbabe22d74757339c60" FOREIGN KEY ("deckId") REFERENCES "deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_e6ba6529c2a8caa86b0bf2f8778" FOREIGN KEY ("priceId") REFERENCES "price"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_e6ba6529c2a8caa86b0bf2f8778"`);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_673081effbabe22d74757339c60"`);
        await queryRunner.query(`DROP TABLE "card"`);
        await queryRunner.query(`DROP TABLE "price"`);
        await queryRunner.query(`DROP TABLE "deck"`);
    }

}
