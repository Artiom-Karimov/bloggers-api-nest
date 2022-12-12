import { Injectable } from '@nestjs/common';
import CommentModel from '../comments/models/comment.model';

@Injectable()
export default abstract class CommentsRepository {
  public abstract get(id: string): Promise<CommentModel | undefined>;
  public abstract create(comment: CommentModel): Promise<string | undefined>;
  public abstract update(model: CommentModel): Promise<boolean>;
  public abstract delete(id: string): Promise<boolean>;
  public abstract banByAdmin(
    userId: string,
    bannedByAdmin: boolean,
  ): Promise<void>;
  public abstract banByBlogger(
    userId: string,
    blogId: string,
    bannedByBlogger: boolean,
  ): Promise<void>;
}
