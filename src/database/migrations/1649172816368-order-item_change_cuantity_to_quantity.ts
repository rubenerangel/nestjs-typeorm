import {MigrationInterface, QueryRunner} from "typeorm";

export class orderItemChangeCuantityToQuantity1649172816368 implements MigrationInterface {
    name = 'orderItemChangeCuantityToQuantity1649172816368'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item" RENAME COLUMN "cuantity" TO "quantity"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item" RENAME COLUMN "quantity" TO "cuantity"`);
    }

}
