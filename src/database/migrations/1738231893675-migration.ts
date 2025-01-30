import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738231893675 implements MigrationInterface {
    name = 'Migration1738231893675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`certificates\` ADD \`imageId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`certificates\` ADD UNIQUE INDEX \`IDX_80a0e890bda0cec5a4e050f26b\` (\`imageId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_80a0e890bda0cec5a4e050f26b\` ON \`certificates\` (\`imageId\`)`);
        await queryRunner.query(`ALTER TABLE \`certificates\` ADD CONSTRAINT \`FK_80a0e890bda0cec5a4e050f26bf\` FOREIGN KEY (\`imageId\`) REFERENCES \`images\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`certificates\` DROP FOREIGN KEY \`FK_80a0e890bda0cec5a4e050f26bf\``);
        await queryRunner.query(`DROP INDEX \`REL_80a0e890bda0cec5a4e050f26b\` ON \`certificates\``);
        await queryRunner.query(`ALTER TABLE \`certificates\` DROP INDEX \`IDX_80a0e890bda0cec5a4e050f26b\``);
        await queryRunner.query(`ALTER TABLE \`certificates\` DROP COLUMN \`imageId\``);
    }

}
