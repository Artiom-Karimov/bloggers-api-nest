import { MigrationInterface, QueryRunner } from 'typeorm';

export class addedQuizStatus1675623771632 implements MigrationInterface {
  name = 'addedQuizStatus1675623771632';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "quiz" ADD "status" character varying(20) NOT NULL DEFAULT 'PendingSecondPlayer'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "quiz" DROP COLUMN "status"`);
  }
}
