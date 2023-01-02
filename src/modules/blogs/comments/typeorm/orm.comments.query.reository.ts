import { Injectable } from '@nestjs/common';
import PageViewModel from '../../../../common/models/page.view.model';
import CommentViewModel from '../models/view/comment.view.model';
import GetCommentsQuery from '../models/input/get.comments.query';
import CommentsQueryRepository from '../interfaces/comments.query.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    throw new Error('GetComments not implemented');
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
}
