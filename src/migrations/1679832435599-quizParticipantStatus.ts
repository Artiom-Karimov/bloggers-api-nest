import { MigrationInterface, QueryRunner } from 'typeorm';

export class quizParticipantStatus1679832435599 implements MigrationInterface {
  name = 'quizParticipantStatus1679832435599';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quiz_participant" ADD "status" character varying(32) COLLATE "C"`,
    );
    await queryRunner.query(
      `
      UPDATE "quiz_participant" SET "status" = 'Win' where "isWinner" = true;
      UPDATE "quiz_participant" SET "status" = 'Lose' where "isWinner" = false;
      UPDATE "quiz_participant" SET "status" = 'Unknown' where "isWinner" is null;
      `,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_participant" DROP COLUMN "isWinner"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quiz_participant" ADD "isWinner" boolean`,
    );
    await queryRunner.query(
      `
      UPDATE "quiz_participant" SET "isWinner" = false where "status" = 'Lose';
      UPDATE "quiz_participant" SET "isWinner" = true where "status" = 'Win';
      `,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_participant" DROP COLUMN "status"`,
    );
  }
}
