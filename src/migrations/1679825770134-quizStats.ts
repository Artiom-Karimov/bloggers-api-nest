import { MigrationInterface, QueryRunner } from 'typeorm';

export class quizStats1679825770134 implements MigrationInterface {
  name = 'quizStats1679825770134';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "quiz_stats" ("userId" uuid NOT NULL, "sumScore" integer NOT NULL, "avgScores" integer NOT NULL, "gamesCount" integer NOT NULL, "winsCount" integer NOT NULL, "lossesCount" integer NOT NULL, "drawsCount" integer NOT NULL, CONSTRAINT "REL_e4497d1b435bdeb5a4106d2996" UNIQUE ("userId"), CONSTRAINT "PK_e4497d1b435bdeb5a4106d29969" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_stats" ADD CONSTRAINT "FK_e4497d1b435bdeb5a4106d29969" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quiz_stats" DROP CONSTRAINT "FK_e4497d1b435bdeb5a4106d29969"`,
    );
    await queryRunner.query(`DROP TABLE "quiz_stats"`);
  }
}
