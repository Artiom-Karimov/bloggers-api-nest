import { Injectable } from '@nestjs/common';
import { Comment } from '../typeorm/models/comment';

@Injectable()
export default abstract class CommentsRepository {
  public abstract get(id: string): Promise<Comment | undefined>;
  public abstract create(comment: Comment): Promise<string | undefined>;
  public abstract update(model: Comment): Promise<boolean>;
  public abstract delete(id: string): Promise<boolean>;
  public abstract banByBlogger(
    userId: string,
    blogId: string,
    bannedByBlogger: boolean,
  ): Promise<void>;
}
