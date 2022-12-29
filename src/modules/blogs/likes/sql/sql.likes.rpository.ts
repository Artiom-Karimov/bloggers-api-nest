import { Injectable } from '@nestjs/common';
import LikeModel from '../models/like.model';
import { DataSource } from 'typeorm';
import LikeMapper from './models/like.mapper';
import Like from './models/like';
import LikesRepository from '../interfaces/likes.repository';

@Injectable()
export default class SqlLikesRepository extends LikesRepository {
  constructor(
    private readonly db: DataSource,
    private readonly entityType: string,
  ) {
    super();
  }

  public async get(entityId: string, userId: string): Promise<LikeModel> {
    const result = await this.db.query(
      `
      select "entityId", "userId", "login" as "userLogin", "userBanned", "status", "lastModified"
      from "like" l left join "user" u on l."userId" = u."id"
      where "entityId" = $1 and "userId" = $2 and "entityType" = $3;
      `,
      [entityId, userId, this.entityType],
    );
    if (!result || result.length === 0) return undefined;
    const like = result[0] as Like;
    return LikeMapper.toDomain(like);
  }
  public async create(data: LikeModel): Promise<boolean> {
    const dbLike = LikeMapper.fromDomain(data);
    await this.db.query(
      `
      insert into "like" ("entityId", "entityType", "userId", "userBanned", "status", "lastModified")
      values ($1,$2,$3,$4,$5,$6);
      `,
      [
        dbLike.entityId,
        this.entityType,
        dbLike.userId,
        dbLike.userBanned,
        dbLike.status,
        dbLike.lastModified,
      ],
    );
    return true;
  }
  public async update(data: LikeModel): Promise<boolean> {
    const dbLike = LikeMapper.fromDomain(data);
    const result = await this.db.query(
      `
      update "like" 
      set "userBanned" = $3, "status" = $4, "lastModified" = $5
      where "entityId" = $1 and "userId" = $2;
      `,
      [
        dbLike.entityId,
        dbLike.userId,
        dbLike.userBanned,
        dbLike.status,
        dbLike.lastModified,
      ],
    );
    return !!result[1];
  }
  public async setUserBanned(
    userId: string,
    userBanned: boolean,
  ): Promise<void> {
    return;
    await this.db.query(
      `
      update "like" 
      set "userBanned" = $3
      where "entityType" = $1 and "userId" = $2;
      `,
      [this.entityType, userId, userBanned],
    );
  }
}
