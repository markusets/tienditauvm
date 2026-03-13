import { MigrationInterface, QueryRunner } from "typeorm";

export class AddClientsModule1741824000000 implements MigrationInterface {
    name = 'AddClientsModule1741824000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`clients\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`cedula\` varchar(255) NOT NULL, \`nombre\` varchar(255) NOT NULL, \`apellido\` varchar(255) NOT NULL, \`balance\` decimal(10,2) NOT NULL DEFAULT '0.00', UNIQUE INDEX \`IDX_clients_cedula\` (\`cedula\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`client_transactions\` (\`id\` varchar(36) NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`amount\` decimal(10,2) NOT NULL, \`description\` varchar(255) NOT NULL, \`date\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`status\` varchar(255) NOT NULL DEFAULT 'active', \`client_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`client_transactions\` ADD CONSTRAINT \`FK_client_transactions_client\` FOREIGN KEY (\`client_id\`) REFERENCES \`clients\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`client_transactions\` DROP FOREIGN KEY \`FK_client_transactions_client\``);
        await queryRunner.query(`DROP TABLE \`client_transactions\``);
        await queryRunner.query(`DROP INDEX \`IDX_clients_cedula\` ON \`clients\``);
        await queryRunner.query(`DROP TABLE \`clients\``);
    }

}
