import { MigrationInterface, QueryRunner } from "typeorm";

export class initialMigration1702204986188 implements MigrationInterface {
    name = 'initialMigration1702204986188'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "modificationDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "userName" character varying NOT NULL, "imagePath" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "country" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "verificationCode" character varying, "isVerified" boolean NOT NULL DEFAULT false, "isActivated" boolean NOT NULL DEFAULT true, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "modificationDate" TIMESTAMP NOT NULL DEFAULT now(), "groupId" integer, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_groups" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "modificationDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ea7760dc75ee1bf0b09ab9b3289" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reset_passwords_requests" ("id" SERIAL NOT NULL, "seed" character varying NOT NULL, "userId" integer NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "modificationDate" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a9376e0286a057a353a23fa0394" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_groups_roles_roles" ("userGroupsId" integer NOT NULL, "rolesId" integer NOT NULL, CONSTRAINT "PK_bfba48df7471f65257352638f00" PRIMARY KEY ("userGroupsId", "rolesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_692b090b21aa3f3f065a5efbad" ON "user_groups_roles_roles" ("userGroupsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b637e4fdf3377fa8e52aa5b2fa" ON "user_groups_roles_roles" ("rolesId") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_b1d770f014b76f7cfb58089dafc" FOREIGN KEY ("groupId") REFERENCES "user_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_groups_roles_roles" ADD CONSTRAINT "FK_692b090b21aa3f3f065a5efbad9" FOREIGN KEY ("userGroupsId") REFERENCES "user_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_groups_roles_roles" ADD CONSTRAINT "FK_b637e4fdf3377fa8e52aa5b2fa6" FOREIGN KEY ("rolesId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_groups_roles_roles" DROP CONSTRAINT "FK_b637e4fdf3377fa8e52aa5b2fa6"`);
        await queryRunner.query(`ALTER TABLE "user_groups_roles_roles" DROP CONSTRAINT "FK_692b090b21aa3f3f065a5efbad9"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_b1d770f014b76f7cfb58089dafc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b637e4fdf3377fa8e52aa5b2fa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_692b090b21aa3f3f065a5efbad"`);
        await queryRunner.query(`DROP TABLE "user_groups_roles_roles"`);
        await queryRunner.query(`DROP TABLE "reset_passwords_requests"`);
        await queryRunner.query(`DROP TABLE "user_groups"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
