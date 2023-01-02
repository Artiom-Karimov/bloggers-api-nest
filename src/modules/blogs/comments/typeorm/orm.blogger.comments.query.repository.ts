import { Injectable } from '@nestjs/common';
import PageViewModel from '../../../../common/models/page.view.model';
import BloggerCommentViewModel from '../models/view/blogger.comment.view.model';
import GetBloggerCommentsQuery from '../models/input/get.blogger.comments.query';
import BloggerCommentsQueryRepository from '../interfaces/blogger.comments.query.repository';
import { Comment } from './models/comment';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import CommentMapper from './models/comment.mapper';
import { LikesInfoModel } from '../../likes/models/likes.info.model';

@Injectable()
export class OrmBloggerCommentsQueryRepository extends BloggerCommentsQueryRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
  ) {
    super();
  }

  public async getBloggerComments(
    params: GetBloggerCommentsQuery,
  ): Promise<PageViewModel<BloggerCommentViewModel>> {
    try {
      const page = await this.getPage(params);
      await this.loadComments(page, params);
      return page;
    } catch (error) {
      console.error(error);
      return new PageViewModel(params.pageNumber, params.pageSize, 0);
    }
  }
  private async getPage(
    params: GetBloggerCommentsQuery,
  ): Promise<PageViewModel<BloggerCommentViewModel>> {
    const count = await this.getCount(params);
    return new PageViewModel<BloggerCommentViewModel>(
      params.pageNumber,
      params.pageSize,
      count,
    );
  }
  private async getCount(params: GetBloggerCommentsQuery): Promise<number> {
    const builder = this.getQueryBuilder(params);
    return builder.getCount();
  }
  private getQueryBuilder(
    params: GetBloggerCommentsQuery,
  ): SelectQueryBuilder<Comment> {
    const builder = this.repo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.post', 'post')
      .leftJoinAndSelect('post.blog', 'blog')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoin('user.ban', 'ban')
      .where('"blog"."ownerId" = :bloggerId', { bloggerId: params.bloggerId })
      .andWhere('"bannedByBlogger" = false')
      .andWhere('("ban"."isBanned" = false or "ban"."isBanned" is null)');

    return builder;
  }
  private async loadComments(
    page: PageViewModel<BloggerCommentViewModel>,
    params: GetBloggerCommentsQuery,
  ): Promise<PageViewModel<BloggerCommentViewModel>> {
    const builder = this.getQueryBuilder(params);

    const result = await builder
      .orderBy(`"comment"."${params.sortBy}"`, params.sortOrder)
      .offset(page.calculateSkip())
      .limit(page.pageSize)
      .getMany();

    const views = result.map((c) =>
      CommentMapper.toBloggerView(c, new LikesInfoModel()),
    );
    return page.add(...views);
  }
}
