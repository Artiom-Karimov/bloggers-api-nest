import { Injectable } from '@nestjs/common';
import { PostLikesQueryRepository } from '../interfaces/post.likes.query.repository';
import { Post } from '../../posts/typeorm/models/post';
import PostViewModel from '../../posts/models/post.view.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import PostMapper from '../../posts/typeorm/models/post.mapper';
import { ExtendedLikesInfoModel } from '../models/likes.info.model';

@Injectable()
export class OrmPostLikesQueryRepository extends PostLikesQueryRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }

  async mergeWithLikes(post: Post, userId?: string): Promise<PostViewModel> {
    const result = await this.db.query(
      `
      select p."id", ${this.getLikesQuery(userId)}
      from "post" p
      where p."id" = '${post.id}'
      `,
    );
    return PostMapper.toView(
      post,
      new ExtendedLikesInfoModel(
        result[0].likesCount,
        result[0].dislikesCount,
        result[0].myStatus,
        result[0].newestLikes,
      ),
    );
  }
  async mergeManyWithLikes(
    posts: Post[],
    userId?: string,
  ): Promise<PostViewModel[]> {
    if (posts.length === 0) return [];

    const ids = posts.map((p) => `'${p.id}'`);

    const result = await this.db.query(
      `
      select p."id", ${this.getLikesQuery(userId)}
      from "post" p
      where p."id" in (${ids.join(', ')})
      `,
    );
    return posts.map((p) => {
      const info = result.find((i) => i.id === p.id);
      return PostMapper.toView(
        p,
        new ExtendedLikesInfoModel(
          info.likesCount,
          info.dislikesCount,
          info.myStatus,
          info.newestLikes,
        ),
      );
    });
  }

  private getLikesQuery(userId?: string): string {
    return `
      (select count(*) from "post_like" l
      left join "user_ban" b on l."userId" = b."userId" 
      where (b."isBanned" = false or b."isBanned" is null) 
      and l."entityId" = p."id" and l."status" = 'Like') as "likesCount",

      (select count(*) from "post_like" l
      left join "user_ban" b on l."userId" = b."userId" 
      where (b."isBanned" = false or b."isBanned" is null) 
      and l."entityId" = p."id" and l."status" = 'Dislike') as "dislikesCount",
      
      ${this.getStatusSubquery(userId)},
      ${this.getNewestLikesSubquery()}
    `;
  }
  private getStatusSubquery(userId?: string): string {
    if (!userId) return `(select 'None') as "myStatus"`;
    return `(select "status" from "post_like" l
    left join "user_ban" b on l."userId" = b."userId" 
    where (b."isBanned" = false or b."isBanned" is null)
    and l."entityId" = p."id" and l."userId" = '${userId}') as "myStatus"`;
  }
  private getNewestLikesSubquery(): string {
    return `(
      select json_agg(row_to_json(nl)) as "newestLikes" from (
        select l."lastModified" as "addedAt", l."userId", u."login"
        from "post_like" l left join "user" u on l."userId" = u."id"
        left join "user_ban" b on l."userId" = b."userId"
        where "entityId" = p."id" and "status" = 'Like' 
        and (b."isBanned" = false or b."isBanned" is null)
        order by "lastModified" desc limit 3
      ) nl
    )`;
  }
}
