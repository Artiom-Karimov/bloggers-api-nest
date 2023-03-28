import { MigrationInterface, QueryRunner } from 'typeorm';

export class quizStats1679981788534 implements MigrationInterface {
  name = 'quizStats1679981788534';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quiz_stats" DROP COLUMN "avgScores"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quiz_stats" ADD "avgScores" integer`);
  }
}
