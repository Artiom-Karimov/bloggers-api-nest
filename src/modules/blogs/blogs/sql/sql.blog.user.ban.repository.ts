import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import BlogUserBanRepository from '../interfaces/blog.user.ban.repository';
import BlogUserBanModel from '../models/blog.user.ban.model';
import { BlogUserBan } from './models/blog.user.ban';
import BlogUserBanMapper from '../typeorm/models/mappers/blog.user.ban.mapper';

@Injectable()
export default class SqlBlogUserBanRepository extends BlogUserBanRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }

  public async get(
    blogId: string,
    userId: string,
  ): Promise<BlogUserBanModel | undefined> {
    const result = await this.db.query(
      `
      select b."blogId", b."userId", b."isBanned", b."banReason", b."banDate", 
      u."login" as "userLogin"
      from "blogUserBan" b left join "user" u
      on b."userId" = u."id"
      where "blogId" = $1 and "userId" = $2;
      `,
      [blogId, userId],
    );
    if (!result || result.length === 0) return undefined;
    const ban = result[0] as BlogUserBan;
    return BlogUserBanMapper.toDomain(ban);
  }
  public async create(ban: BlogUserBanModel): Promise<string | undefined> {
    const dbBan = BlogUserBanMapper.fromDomain(ban);
    await this.db.query(
      `
      insert into "blogUserBan" ("blogId","userId","isBanned","banReason","banDate")
      values ($1,$2,$3,$4,$5);
      `,
      [
        dbBan.blogId,
        dbBan.userId,
        dbBan.isBanned,
        dbBan.banReason,
        dbBan.banDate,
      ],
    );
    return dbBan.blogId + dbBan.userId;
  }
  public async delete(blogId: string, userId: string): Promise<boolean> {
    const result = await this.db.query(
      `
      delete from "blogUserBan"
      where "blogId" = $1 and "userId" = $2;
      `,
      [blogId, userId],
    );
    return !!result[1];
  }
}
