import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyUser1694075361416 implements MigrationInterface {
    name = 'ModifyUser1694075361416'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`vip\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`vip2\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`vip2\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`vip\` varchar(255) NOT NULL`);
    }

}
