import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import PostsRepository from '../interfaces/posts.repository';
import PostModel from '../models/post.model';
import Post from './models/post';
import PostMapper from './models/post.mapper';

@Injectable()
export default class SqlPostsRepository extends PostsRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }

  public async get(id: string): Promise<PostModel | undefined> {
    const result = await this.db.query(
      `
      select p."id", p."blogId", p."blogBanned", p."title", 
      p."shortDescription", p."content", p."createdAt",
      b."name" as "blogName"
      from "post" p left join "blog" b
      on p."blogId" = b."id"
      where p."id" = $1;
      `,
      [id],
    );
    if (!result || result.length === 0) return undefined;
    const ban = result[0] as Post;
    return PostMapper.toDomain(ban);
  }
  public async create(post: PostModel): Promise<string | undefined> {
    const dbPost = PostMapper.fromDomain(post);
    await this.db.query(
      `
      insert into "post" ("id","blogId","blogBanned","title","shortDescription","content","createdAt")
      values ($1,$2,$3,$4,$5,$6,$7);
      `,
      [
        dbPost.id,
        dbPost.blogId,
        dbPost.blogBanned,
        dbPost.title,
        dbPost.shortDescription,
        dbPost.content,
        dbPost.createdAt,
      ],
    );
    return dbPost.id;
  }
  public async update(model: PostModel): Promise<boolean> {
    const dbPost = PostMapper.fromDomain(model);
    const result = await this.db.query(
      `
      update "post" 
      set "blogBanned" = $2, "title" = $3, "shortDescription" = $4, "content" = $5
      where "id" = $1;
      `,
      [
        dbPost.id,
        dbPost.blogBanned,
        dbPost.title,
        dbPost.shortDescription,
        dbPost.content,
      ],
    );
    return !!result[1];
  }
  public async delete(id: string): Promise<boolean> {
    const result = await this.db.query(
      `
      delete from "post"
      where "id" = $1;
      `,
      [id],
    );
    return !!result[1];
  }
  public async setBlogBan(
    blogId: string,
    blogBanned: boolean,
  ): Promise<boolean> {
    await this.db.query(
      `
      update "post" 
      set "blogBanned" = $2
      where "blogId" = $1;
      `,
      [blogId, blogBanned],
    );
    return true;
  }
}
