import { Injectable } from '@nestjs/common';
import PageViewModel from '../../../../common/models/page.view.model';
import CommentViewModel from '../models/view/comment.view.model';
import GetCommentsQuery from '../models/input/get.comments.query';
import CommentsQueryRepository from '../interfaces/comments.query.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import CommentMapper from './models/comment.mapper';
import { LikesInfoModel } from '../../likes/models/likes.info.model';
import { Comment } from './models/comment';

@Injectable()
export class OrmCommentsQueryRepository extends CommentsQueryRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
  ) {
    super();
  }

  public async getComments(
    params: GetCommentsQuery,
  ): Promise<PageViewModel<CommentViewModel>> {
    try {
      const page = await this.getPage(params);
      await this.loadComments(page, params);
      return page;
    } catch (error) {
      console.error(error);
      return new PageViewModel(params.pageNumber, params.pageSize, 0);
    }
  }

  public async getComment(
    id: string,
    userId: string | undefined,
  ): Promise<CommentViewModel | undefined> {
    try {
      const comment: Comment = await this.repo
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoinAndSelect('user.ban', 'ban')
        .where('"comment"."id" = :id', { id })
        .andWhere('("ban"."isBanned" = false or "ban"."isBanned" is null)')
        .getOne();

      return comment
        ? CommentMapper.toView(comment, new LikesInfoModel())
        : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  private async getPage(
    params: GetCommentsQuery,
  ): Promise<PageViewModel<CommentViewModel>> {
    const count = await this.getCount(params);
    return new PageViewModel<CommentViewModel>(
      params.pageNumber,
      params.pageSize,
      count,
    );
  }

  private async getCount(params: GetCommentsQuery): Promise<number> {
    const builder = this.getQueryBuilder(params);
    return builder.getCount();
  }

  private getQueryBuilder(
    params: GetCommentsQuery,
  ): SelectQueryBuilder<Comment> {
    const builder = this.repo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoin('user.ban', 'ban')
      .where('"bannedByBlogger" = false')
      .andWhere('("ban"."isBanned" = false or "ban"."isBanned" is null)');
    if (params.postId) {
      builder.andWhere('"postId" = :postId', { postId: params.postId });
    }
    return builder;
  }

  private async loadComments(
    page: PageViewModel<CommentViewModel>,
    params: GetCommentsQuery,
  ): Promise<PageViewModel<CommentViewModel>> {
    const builder = this.getQueryBuilder(params);

    const result = await builder
      .orderBy(`"comment"."${params.sortBy}"`, params.sortOrder)
      .offset(page.calculateSkip())
      .limit(page.pageSize)
      .getMany();

    const views = result.map((c) =>
      CommentMapper.toView(c, new LikesInfoModel()),
    );
    return page.add(...views);
  }
}
