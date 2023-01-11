import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeQuestion1673454334930 implements MigrationInterface {
  name = 'changeQuestion1673454334930';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question" ALTER COLUMN "updatedAt" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ALTER COLUMN "updatedAt" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question" ALTER COLUMN "updatedAt" SET DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ALTER COLUMN "updatedAt" SET NOT NULL`,
    );
  }
}
