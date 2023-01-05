import { Injectable } from '@nestjs/common';
import PageViewModel from '../../../../common/models/page.view.model';
import GetPostsQuery from '../models/get.posts.query';
import PostViewModel from '../models/post.view.model';
import PostsQueryRepository from '../interfaces/posts.query.repository';
import { Post } from './models/post';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PostLikesQueryRepository } from '../../likes/interfaces/post.likes.query.repository';

@Injectable()
export class OrmPostsQueryRepository extends PostsQueryRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repo: Repository<Post>,
    private readonly likesRepo: PostLikesQueryRepository,
  ) {
    super();
  }

  public async getPosts(
    params: GetPostsQuery,
  ): Promise<PageViewModel<PostViewModel>> {
    try {
      const page = await this.getPage(params);
      await this.loadPosts(page, params);
      return page;
    } catch (error) {
      console.error(error);
      return new PageViewModel(params.pageNumber, params.pageSize, 0);
    }
  }

  public async getPost(
    id: string,
    userId?: string,
  ): Promise<PostViewModel | undefined> {
    try {
      const post = await this.repo
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.blog', 'blog')
        .leftJoinAndSelect('blog.ban', 'ban')
        .where('"post"."id" = :id', { id })
        .andWhere('("ban"."isBanned" = false or "ban"."isBanned" is null)')
        .getOne();
      return post ? this.likesRepo.mergeWithLikes(post, userId) : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  private async getPage(
    params: GetPostsQuery,
  ): Promise<PageViewModel<PostViewModel>> {
    return new PageViewModel<PostViewModel>(
      params.pageNumber,
      params.pageSize,
      0,
    );
  }
  private async loadPosts(
    page: PageViewModel<PostViewModel>,
    params: GetPostsQuery,
  ): Promise<PageViewModel<PostViewModel>> {
    const builder = this.getQueryBuilder(params);

    const [result, count] = await builder
      .orderBy(this.getSortParam(params), params.sortOrder)
      .offset(page.calculateSkip())
      .limit(page.pageSize)
      .getManyAndCount();

    page.setTotalCount(count);
    const views = await this.likesRepo.mergeManyWithLikes(
      result,
      params.userId,
    );
    return page.add(...views);
  }
  private getQueryBuilder(params: GetPostsQuery): SelectQueryBuilder<Post> {
    const builder = this.repo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.blog', 'blog')
      .leftJoin('blog.ban', 'ban')
      .where('("ban"."isBanned" = false or "ban"."isBanned" is null)');
    if (params.blogId) {
      builder.andWhere('"blog"."id" = :blogId', { blogId: params.blogId });
    }
    return builder;
  }
  private getSortParam(params: GetPostsQuery): string {
    if (params.sortBy === 'blogName') return '"blog"."name"';
    return `"post"."${params.sortBy}"`;
  }
}
