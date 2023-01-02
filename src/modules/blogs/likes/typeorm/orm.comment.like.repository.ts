import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentLike } from './models/comment.like';
import { CommentLikeRepository } from '../interfaces/comment.like.repository';

@Injectable()
export class OrmCommentLikeRepository extends CommentLikeRepository {
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
