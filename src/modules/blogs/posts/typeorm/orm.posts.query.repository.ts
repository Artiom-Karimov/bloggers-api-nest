import { Injectable } from '@nestjs/common';
import PageViewModel from '../../../../common/models/page.view.model';
import GetPostsQuery from '../models/get.posts.query';
import PostViewModel from '../models/post.view.model';
import PostsQueryRepository from '../interfaces/posts.query.repository';
import { Post } from './models/post';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import PostMapper from './models/post.mapper';
import { ExtendedLikesInfoModel } from '../../likes/models/likes.info.model';

@Injectable()
export class OrmPostsQueryRepository extends PostsQueryRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repo: Repository<Post>,
  ) {
    super();
  }

  public async getPosts(
    params: GetPostsQuery,
  ): Promise<PageViewModel<PostViewModel>> {
    throw new Error('GetPosts not implemented');
  }

  public async getPost(
    id: string,
    userId: string | undefined,
  ): Promise<PostViewModel | undefined> {
    try {
      const post = await this.repo
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.blog', 'blog')
        .leftJoinAndSelect('blog.ban', 'ban')
        .where('"post"."id" = :id', { id })
        .andWhere('("ban"."isBanned" = false or "ban"."isBanned" is null)')
        .getOne();
      return post
        ? PostMapper.toView(post, new ExtendedLikesInfoModel())
        : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
