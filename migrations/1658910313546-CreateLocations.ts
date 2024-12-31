import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLocations1658910313546 implements MigrationInterface {
    name = 'CreateLocations1658910313546';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "locations" (
                "id" SERIAL NOT NULL,
                "userId" integer NOT NULL,
                "cityName" character varying(100) NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_4c95b83a8e78f1d36c5f4b64a12" PRIMARY KEY ("id"),
                CONSTRAINT "FK_23d5b838b40c632917e2b1549f3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "locations" DROP CONSTRAINT "FK_23d5b838b40c632917e2b1549f3"`,
        );
        await queryRunner.query(`DROP TABLE "locations"`);
    }
}
