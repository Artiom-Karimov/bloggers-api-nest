import { Injectable } from '@nestjs/common';
import CommentInputModel from '../models/comments/comment.input.model';
import CommentModel from '../models/comments/comment.model';
import CommentsRepository from './comments.repository';

@Injectable()
export default class CommentsService {
  constructor(private readonly repo: CommentsRepository) { }

  public async create(data: CommentInputModel): Promise<CommentModel> {
    const comment = CommentModel.create(data);
    const created = await this.repo.create(comment);
    if (!created) return undefined;
    return this.repo.get(created);
  }
}
