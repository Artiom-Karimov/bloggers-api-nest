import { MigrationInterface, QueryRunner } from 'typeorm';

export class quizParticipantStatus1679832435599 implements MigrationInterface {
  name = 'quizParticipantStatus1679832435599';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quiz_participant" DROP COLUMN "isWinner"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_participant" ADD "status" character varying(32) COLLATE "C"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quiz_participant" DROP COLUMN "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "quiz_participant" ADD "isWinner" boolean`,
    );
  }
}
