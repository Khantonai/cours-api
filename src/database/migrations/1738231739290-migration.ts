import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738231739290 implements MigrationInterface {
    name = 'Migration1738231739290'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`certificates\` DROP FOREIGN KEY \`FK_9dba6180a111f044af37896524e\``);
        await queryRunner.query(`ALTER TABLE \`images\` DROP FOREIGN KEY \`FK_4abde6dad4760931ab903f8a806\``);
        await queryRunner.query(`ALTER TABLE \`certificates\` CHANGE \`userIdId\` \`userId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`images\` CHANGE \`userIdId\` \`userId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`certificates\` ADD CONSTRAINT \`FK_7d072194aef1ecb98664c83e861\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`images\` ADD CONSTRAINT \`FK_96514329909c945f10974aff5f8\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`images\` DROP FOREIGN KEY \`FK_96514329909c945f10974aff5f8\``);
        await queryRunner.query(`ALTER TABLE \`certificates\` DROP FOREIGN KEY \`FK_7d072194aef1ecb98664c83e861\``);
        await queryRunner.query(`ALTER TABLE \`images\` CHANGE \`userId\` \`userIdId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`certificates\` CHANGE \`userId\` \`userIdId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`images\` ADD CONSTRAINT \`FK_4abde6dad4760931ab903f8a806\` FOREIGN KEY (\`userIdId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`certificates\` ADD CONSTRAINT \`FK_9dba6180a111f044af37896524e\` FOREIGN KEY (\`userIdId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
