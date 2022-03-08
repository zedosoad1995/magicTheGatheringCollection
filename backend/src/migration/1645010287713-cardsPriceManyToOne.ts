import {MigrationInterface, QueryRunner} from "typeorm";

export class cardsPriceManyToOne1645010287713 implements MigrationInterface {
    name = 'cardsPriceManyToOne1645010287713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_e6ba6529c2a8caa86b0bf2f8778"`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "priceId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "REL_e6ba6529c2a8caa86b0bf2f877"`);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_e6ba6529c2a8caa86b0bf2f8778" FOREIGN KEY ("priceId") REFERENCES "price"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card" DROP CONSTRAINT "FK_e6ba6529c2a8caa86b0bf2f8778"`);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "REL_e6ba6529c2a8caa86b0bf2f877" UNIQUE ("priceId")`);
        await queryRunner.query(`ALTER TABLE "card" ALTER COLUMN "priceId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "card" ADD CONSTRAINT "FK_e6ba6529c2a8caa86b0bf2f8778" FOREIGN KEY ("priceId") REFERENCES "price"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
