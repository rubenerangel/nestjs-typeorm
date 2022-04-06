import {MigrationInterface, QueryRunner} from "typeorm";

export class init1649263199109 implements MigrationInterface {
    name = 'init1649263199109'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products_cateogories" DROP CONSTRAINT "FK_2312f9495b339eecd0eea79e5e5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2312f9495b339eecd0eea79e5e"`);
        await queryRunner.query(`ALTER TABLE "products_cateogories" RENAME COLUMN "category:id" TO "category_id"`);
        await queryRunner.query(`ALTER TABLE "products_cateogories" RENAME CONSTRAINT "PK_46e3393f88d60e35d9cce052a8e" TO "PK_0b1a7d3b912147fa9c2274018df"`);
        await queryRunner.query(`CREATE INDEX "IDX_bc1e2d77a22bb6c1428944bf0b" ON "products_cateogories" ("category_id") `);
        await queryRunner.query(`ALTER TABLE "products_cateogories" ADD CONSTRAINT "FK_bc1e2d77a22bb6c1428944bf0b4" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products_cateogories" DROP CONSTRAINT "FK_bc1e2d77a22bb6c1428944bf0b4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bc1e2d77a22bb6c1428944bf0b"`);
        await queryRunner.query(`ALTER TABLE "products_cateogories" RENAME CONSTRAINT "PK_0b1a7d3b912147fa9c2274018df" TO "PK_46e3393f88d60e35d9cce052a8e"`);
        await queryRunner.query(`ALTER TABLE "products_cateogories" RENAME COLUMN "category_id" TO "category:id"`);
        await queryRunner.query(`CREATE INDEX "IDX_2312f9495b339eecd0eea79e5e" ON "products_cateogories" ("category:id") `);
        await queryRunner.query(`ALTER TABLE "products_cateogories" ADD CONSTRAINT "FK_2312f9495b339eecd0eea79e5e5" FOREIGN KEY ("category:id") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
