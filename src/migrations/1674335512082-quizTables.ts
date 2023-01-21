import { MigrationInterface, QueryRunner } from 'typeorm';

export class quizTables1674335512082 implements MigrationInterface {
  name = 'quizTables1674335512082';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "body" character varying(500) COLLATE "C" NOT NULL, "answers" character varying(500) array COLLATE "C" NOT NULL, "published" boolean NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "quiz_question" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quizId" uuid NOT NULL, "questionId" uuid NOT NULL, "questionOrder" integer NOT NULL, CONSTRAINT "PK_0bab74c2a71b9b3f8a941104083" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "quiz_answer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "questionId" uuid NOT NULL, "participantId" uuid NOT NULL, "answer" character varying, "isCorrect" boolean NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_926d49bc4559c8200b6c6c2c22f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_db98d60a9fae0d7478aa954319" ON "quiz_answer" ("questionId", "participantId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "quiz_participant" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quizId" uuid NOT NULL, "userId" uuid, "score" integer NOT NULL DEFAULT '0', "isWinner" boolean, "addedAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_70aabc69ff5a35ea9276eef792b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_816e42b14354167db5e874ead6" ON "quiz_participant" ("quizId", "userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "quiz" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "startedAt" TIMESTAMP WITH TIME ZONE, "endedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_422d974e7217414e029b3e641d0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_question" ADD CONSTRAINT "FK_13b266ec53985f521fb503a072e" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_question" ADD CONSTRAINT "FK_2ebbbffc3d71d220cb170bb7793" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_answer" ADD CONSTRAINT "FK_fe27c8ed84eee5f742982ffff57" FOREIGN KEY ("questionId") REFERENCES "quiz_question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_answer" ADD CONSTRAINT "FK_6f777c568dbfa540674a91c4fd7" FOREIGN KEY ("participantId") REFERENCES "quiz_participant"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_participant" ADD CONSTRAINT "FK_8c8df20fbe968e4143a12d176f5" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_participant" ADD CONSTRAINT "FK_5403ae6bdf467e6e79d878e3675" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quiz_participant" DROP CONSTRAINT "FK_5403ae6bdf467e6e79d878e3675"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_participant" DROP CONSTRAINT "FK_8c8df20fbe968e4143a12d176f5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_answer" DROP CONSTRAINT "FK_6f777c568dbfa540674a91c4fd7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_answer" DROP CONSTRAINT "FK_fe27c8ed84eee5f742982ffff57"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_question" DROP CONSTRAINT "FK_2ebbbffc3d71d220cb170bb7793"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_question" DROP CONSTRAINT "FK_13b266ec53985f521fb503a072e"`,
    );
    await queryRunner.query(`DROP TABLE "quiz"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_816e42b14354167db5e874ead6"`,
    );
    await queryRunner.query(`DROP TABLE "quiz_participant"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_db98d60a9fae0d7478aa954319"`,
    );
    await queryRunner.query(`DROP TABLE "quiz_answer"`);
    await queryRunner.query(`DROP TABLE "quiz_question"`);
    await queryRunner.query(`DROP TABLE "question"`);
  }
}
