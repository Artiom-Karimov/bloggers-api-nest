import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeQuizParticipant1674234102710 implements MigrationInterface {
  name = 'changeQuizParticipant1674234102710';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quiz_participant" ADD "addedAt" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quiz_participant" DROP COLUMN "addedAt"`,
    );
  }
}
