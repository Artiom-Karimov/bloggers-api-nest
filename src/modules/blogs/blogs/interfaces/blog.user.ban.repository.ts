import { Injectable } from '@nestjs/common';
import { BlogUserBan } from '../typeorm/models/blog.user.ban';

@Injectable()
export default abstract class BlogUserBanRepository {
  public abstract get(
    blogId: string,
    userId: string,
  ): Promise<BlogUserBan | undefined>;
  public abstract create(ban: BlogUserBan): Promise<string | undefined>;
  public abstract delete(blogId: string, userId: string): Promise<boolean>;
}
