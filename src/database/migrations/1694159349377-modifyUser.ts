import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyUser1694159349377 implements MigrationInterface {
    name = 'ModifyUser1694159349377'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`full_name\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`full_name\``);
    }

}
