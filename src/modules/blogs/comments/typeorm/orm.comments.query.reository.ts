import { Injectable } from '@nestjs/common';
import PageViewModel from '../../../../common/models/page.view.model';
import CommentViewModel from '../models/view/comment.view.model';
import GetCommentsQuery from '../models/input/get.comments.query';
import CommentsQueryRepository from '../interfaces/comments.query.repository';
import { Comment } from './models/comment';
import { CommentLikesQueryRepository } from '../../likes/interfaces/comment.likes.query.repository';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrmCommentsQueryRepository extends CommentsQueryRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
    private readonly likesRepo: CommentLikesQueryRepository,
  ) {
    super();
  }

  public async getComments(
    params: GetCommentsQuery,
  ): Promise<PageViewModel<CommentViewModel>> {
    try {
      const page = await this.loadComments(params);
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
      const comment = await this.repo
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .leftJoinAndSelect('user.ban', 'ban')
        .where('"comment"."id" = :id', { id })
        .andWhere('("ban"."isBanned" = false or "ban"."isBanned" is null)')
        .getOne();

      return comment
        ? this.likesRepo.mergeWithLikes(comment, userId)
        : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  private getQueryBuilder(
    params: GetCommentsQuery,
    page: PageViewModel<CommentViewModel>,
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
    return builder
      .orderBy(`"comment"."${params.sortBy}"`, params.sortOrder)
      .offset(page.calculateSkip())
      .limit(page.pageSize);
  }

  private async loadComments(
    params: GetCommentsQuery,
  ): Promise<PageViewModel<CommentViewModel>> {
    const page = new PageViewModel<CommentViewModel>(
      params.pageNumber,
      params.pageSize,
      0,
    );
    const builder = this.getQueryBuilder(params, page);
    const [result, count] = await builder.getManyAndCount();
    page.setTotalCount(count);

    const views = await this.likesRepo.mergeManyWithLikes(
      result,
      params.userId,
    );
    return page.add(...views);
  }
}
