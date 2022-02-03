import {MigrationInterface, QueryRunner} from "typeorm";

export class SwitchFKFromCardToPrice1643879509852 implements MigrationInterface {
    name = 'SwitchFKFromCardToPrice1643879509852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_e6ba6529c2a8caa86b0bf2f8778"`);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "REL_e6ba6529c2a8caa86b0bf2f877"`);
        await queryRunner.query(`ALTER TABLE "card" DROP COLUMN "priceId"`);
        await queryRunner.query(`ALTER TABLE "price" ADD "cardId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "price" ADD CONSTRAINT "UQ_5d21e3b7b80eee10fa0bd7ac910" UNIQUE ("cardId")`);
        await queryRunner.query(`ALTER TABLE "price" ADD CONSTRAINT "FK_5d21e3b7b80eee10fa0bd7ac910" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "price" DROP CONSTRAINT "FK_5d21e3b7b80eee10fa0bd7ac910"`);
        await queryRunner.query(`ALTER TABLE "price" DROP CONSTRAINT "UQ_5d21e3b7b80eee10fa0bd7ac910"`);
        await queryRunner.query(`ALTER TABLE "price" DROP COLUMN "cardId"`);
        await queryRunner.query(`ALTER TABLE "card" ADD "priceId" integer`);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "REL_e6ba6529c2a8caa86b0bf2f877" UNIQUE ("priceId")`);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_e6ba6529c2a8caa86b0bf2f8778" FOREIGN KEY ("priceId") REFERENCES "price"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
