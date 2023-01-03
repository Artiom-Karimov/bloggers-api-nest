import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentLike } from './models/comment.like';
import { LikesRepository } from '../interfaces/likes.repository';

@Injectable()
export class OrmCommentLikeRepository extends LikesRepository<CommentLike> {
  constructor(
    @InjectRepository(CommentLike)
    private readonly repo: Repository<CommentLike>,
  ) {
    super();
  }

  public async put(like: CommentLike): Promise<boolean> {
    try {
      const result = await this.repo.save(like);
      return !!result;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
