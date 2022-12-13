import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Exception } from 'handlebars';
import { DataSource } from 'typeorm';
import PageViewModel from '../../../../common/models/page.view.model';
import { ExtendedLikesInfoModel } from '../../likes/models/likes.info.model';
import PostsQueryRepository from '../interfaces/posts.query.repository';
import GetPostsQuery from '../models/get.posts.query';
import PostViewModel from '../models/post.view.model';
import Post from './models/post';
import PostMapper from './models/post.mapper';

@Injectable()
export default class SqlPostsQueryRepository extends PostsQueryRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }

  public async getPosts(
    params: GetPostsQuery,
  ): Promise<PageViewModel<PostViewModel>> {
    throw new Exception('Not implemented');
  }

  // TODO: get actual likes
  public async getPost(
    id: string,
    userId: string | undefined,
  ): Promise<PostViewModel | undefined> {
    const result = await this.db.query(
      `
      select p."id", p."blogId", p."blogBanned", p."title", 
      p."shortDescription", p."content", p."createdAt",
      b."name" as "blogName"
      from "post" p left join "blog" b
      on p."blogId" = b."id"
      where p."id" = $1 and p."blogBanned" = false;
      `,
      [id],
    );
    if (!result || result.length === 0) return undefined;
    const post = result[0] as Post;
    return PostMapper.toView(post, new ExtendedLikesInfoModel());
  }
}
