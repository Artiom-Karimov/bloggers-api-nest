import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import LikesRepository from '../interfaces/likes.repository';
import { Like } from '../typeorm/models/like';

@Injectable()
export default class SqlLikesRepository extends LikesRepository {
  constructor(
    private readonly db: DataSource,
    private readonly tableName: string,
  ) {
    super();
  }

  public async get(entityId: string, userId: string): Promise<Like> {
    const result = await this.db.query(
      `
      select "entityId", "userId", "login" as "userLogin", "status", "lastModified"
      from "${this.tableName}" l left join "user" u on l."userId" = u."id"
      where "entityId" = $1 and "userId" = $2;
      `,
      [entityId, userId],
    );
    if (!result || result.length === 0) return undefined;
    const like = result[0] as Like;
    return like;
  }
  public async create(like: Like): Promise<boolean> {
    await this.db.query(
      `
      insert into "${this.tableName}" ("entityId", "userId", "status", "lastModified")
      values ($1,$2,$3,$4);
      `,
      [like.entityId, like.userId, like.status, like.lastModified],
    );
    return true;
  }
  public async update(like: Like): Promise<boolean> {
    const result = await this.db.query(
      `
      update "${this.tableName}"
      set "status" = $3, "lastModified" = $4
      where "entityId" = $1 and "userId" = $2;
      `,
      [like.entityId, like.userId, like.status, like.lastModified],
    );
    return !!result[1];
  }
}
