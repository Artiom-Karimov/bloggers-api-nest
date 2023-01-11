import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1673264825874 implements MigrationInterface {
  name = 'init1673264825874';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_ban" ("userId" uuid NOT NULL, "isBanned" boolean NOT NULL, "banReason" character varying(1000) COLLATE "C", "banDate" TIMESTAMP WITH TIME ZONE, CONSTRAINT "REL_29416a34d6a46110133499f1cf" UNIQUE ("userId"), CONSTRAINT "PK_29416a34d6a46110133499f1cf0" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "email_confirmation" ("userId" uuid NOT NULL, "confirmed" boolean NOT NULL, "code" character varying COLLATE "C", "expiration" TIMESTAMP WITH TIME ZONE, CONSTRAINT "REL_28d3d3fbd7503f3428b94fd18c" UNIQUE ("userId"), CONSTRAINT "PK_28d3d3fbd7503f3428b94fd18cc" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "recovery" ("userId" uuid NOT NULL, "code" character varying COLLATE "C", "expiration" TIMESTAMP WITH TIME ZONE, CONSTRAINT "REL_318d006fbaa2a2aa666c3af387" UNIQUE ("userId"), CONSTRAINT "PK_318d006fbaa2a2aa666c3af387e" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("deviceId" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "deviceName" character varying(500) COLLATE "C", "ip" character varying(500) COLLATE "C", "issuedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_c57e995074bf9afc1a2953d2329" PRIMARY KEY ("deviceId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_ban" ("blogId" uuid NOT NULL, "isBanned" boolean NOT NULL, "banDate" TIMESTAMP WITH TIME ZONE, CONSTRAINT "REL_8ba76abb3506e77eef5c4a2374" UNIQUE ("blogId"), CONSTRAINT "PK_8ba76abb3506e77eef5c4a23746" PRIMARY KEY ("blogId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_user_ban" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "blogId" uuid NOT NULL, "userId" uuid NOT NULL, "isBanned" boolean NOT NULL, "banReason" character varying(1000) COLLATE "C", "banDate" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_2b8b2cd11c3625907f160b0f45d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_4dcb58f0a20d12ee4f3639eaeb" ON "blog_user_ban" ("userId", "blogId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "comment_like" ("status" character varying(20) COLLATE "C" NOT NULL, "lastModified" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" uuid NOT NULL, "entityId" uuid NOT NULL, CONSTRAINT "PK_80aeac56efae3c2c1223d96b9d5" PRIMARY KEY ("userId", "entityId"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_80aeac56efae3c2c1223d96b9d" ON "comment_like" ("userId", "entityId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying(300) COLLATE "C" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "bannedByBlogger" boolean NOT NULL, "postId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_like" ("status" character varying(20) COLLATE "C" NOT NULL, "lastModified" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" uuid NOT NULL, "entityId" uuid NOT NULL, CONSTRAINT "PK_88da51126bfa46b3359c1b0b744" PRIMARY KEY ("userId", "entityId"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_88da51126bfa46b3359c1b0b74" ON "post_like" ("userId", "entityId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(30) COLLATE "C" NOT NULL, "shortDescription" character varying(100) COLLATE "C" NOT NULL, "content" character varying(1000) COLLATE "C" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "blogId" uuid NOT NULL, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(15) COLLATE "C" NOT NULL, "description" character varying(500) COLLATE "C" NOT NULL, "websiteUrl" character varying(100) COLLATE "C" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "ownerId" uuid, CONSTRAINT "PK_85c6532ad065a448e9de7638571" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying(10) COLLATE "C" NOT NULL, "email" character varying(200) COLLATE "C" NOT NULL, "hash" character varying(200) COLLATE "C" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_ban" ADD CONSTRAINT "FK_29416a34d6a46110133499f1cf0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_confirmation" ADD CONSTRAINT "FK_28d3d3fbd7503f3428b94fd18cc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "recovery" ADD CONSTRAINT "FK_318d006fbaa2a2aa666c3af387e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_ban" ADD CONSTRAINT "FK_8ba76abb3506e77eef5c4a23746" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_user_ban" ADD CONSTRAINT "FK_7d7d60d4db1afd77b0e6fe8bc40" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_user_ban" ADD CONSTRAINT "FK_0ad3060a1876f02556828a6801f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_like" ADD CONSTRAINT "FK_b5a2fc7a9a2b6bcc8c74f6fbb8b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_like" ADD CONSTRAINT "FK_f24c3ebf03014e21ed369355a40" FOREIGN KEY ("entityId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_like" ADD CONSTRAINT "FK_909fc474ef645901d01f0cc0662" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_like" ADD CONSTRAINT "FK_3b708bcfa7cd227ce8a496c80b8" FOREIGN KEY ("entityId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD CONSTRAINT "FK_d0418ddc42c5707dbc37b05bef9" FOREIGN KEY ("blogId") REFERENCES "blog"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog" ADD CONSTRAINT "FK_2168be0207735471e4dc0f72bb0" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blog" DROP CONSTRAINT "FK_2168be0207735471e4dc0f72bb0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" DROP CONSTRAINT "FK_d0418ddc42c5707dbc37b05bef9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_like" DROP CONSTRAINT "FK_3b708bcfa7cd227ce8a496c80b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_like" DROP CONSTRAINT "FK_909fc474ef645901d01f0cc0662"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_94a85bb16d24033a2afdd5df060"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_like" DROP CONSTRAINT "FK_f24c3ebf03014e21ed369355a40"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_like" DROP CONSTRAINT "FK_b5a2fc7a9a2b6bcc8c74f6fbb8b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_user_ban" DROP CONSTRAINT "FK_0ad3060a1876f02556828a6801f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_user_ban" DROP CONSTRAINT "FK_7d7d60d4db1afd77b0e6fe8bc40"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_ban" DROP CONSTRAINT "FK_8ba76abb3506e77eef5c4a23746"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "recovery" DROP CONSTRAINT "FK_318d006fbaa2a2aa666c3af387e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_confirmation" DROP CONSTRAINT "FK_28d3d3fbd7503f3428b94fd18cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_ban" DROP CONSTRAINT "FK_29416a34d6a46110133499f1cf0"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "blog"`);
    await queryRunner.query(`DROP TABLE "post"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_88da51126bfa46b3359c1b0b74"`,
    );
    await queryRunner.query(`DROP TABLE "post_like"`);
    await queryRunner.query(`DROP TABLE "comment"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_80aeac56efae3c2c1223d96b9d"`,
    );
    await queryRunner.query(`DROP TABLE "comment_like"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4dcb58f0a20d12ee4f3639eaeb"`,
    );
    await queryRunner.query(`DROP TABLE "blog_user_ban"`);
    await queryRunner.query(`DROP TABLE "blog_ban"`);
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "recovery"`);
    await queryRunner.query(`DROP TABLE "email_confirmation"`);
    await queryRunner.query(`DROP TABLE "user_ban"`);
  }
}
