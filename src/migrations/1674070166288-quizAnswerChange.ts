import { MigrationInterface, QueryRunner } from 'typeorm';

export class quizAnswerChange1674070166288 implements MigrationInterface {
  name = 'quizAnswerChange1674070166288';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quiz_answer" ADD "isCorrect" boolean NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quiz_answer" DROP COLUMN "isCorrect"`,
    );
  }
}
