import { Injectable } from '@nestjs/common';
import PageViewModel from '../../../../common/models/page.view.model';
import BloggerCommentViewModel from '../models/view/blogger.comment.view.model';
import GetBloggerCommentsQuery from '../models/input/get.blogger.comments.query';
import BloggerCommentsQueryRepository from '../interfaces/blogger.comments.query.repository';
import { Comment } from './models/comment';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CommentLikesQueryRepository } from '../../likes/interfaces/comment.likes.query.repository';

@Injectable()
export class OrmBloggerCommentsQueryRepository extends BloggerCommentsQueryRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
    private readonly likeRepo: CommentLikesQueryRepository,
  ) {
    super();
  }

  public async getBloggerComments(
    params: GetBloggerCommentsQuery,
  ): Promise<PageViewModel<BloggerCommentViewModel>> {
    try {
      const page = await this.loadComments(params);
      return page;
    } catch (error) {
      console.error(error);
      return new PageViewModel(params.pageNumber, params.pageSize, 0);
    }
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
    params: GetBloggerCommentsQuery,
  ): Promise<PageViewModel<BloggerCommentViewModel>> {
    const page = new PageViewModel<BloggerCommentViewModel>(
      params.pageNumber,
      params.pageSize,
      0,
    );
    const builder = this.getQueryBuilder(params);

    const [result, count] = await builder
      .orderBy(`"comment"."${params.sortBy}"`, params.sortDirection)
      .offset(page.calculateSkip())
      .limit(page.pageSize)
      .getManyAndCount();

    page.setTotalCount(count);
    const views = await this.likeRepo.mergeManyWithLikesBlogger(
      result,
      params.bloggerId,
    );
    return page.add(...views);
  }
}
