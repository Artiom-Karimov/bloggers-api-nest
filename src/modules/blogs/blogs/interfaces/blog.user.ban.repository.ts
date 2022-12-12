import { Injectable } from '@nestjs/common';
import BlogUserBanModel from '../models/blog.user.ban.model';

@Injectable()
export default abstract class BlogUserBanRepository {
  public abstract get(
    blogId: string,
    userId: string,
  ): Promise<BlogUserBanModel | undefined>;
  public abstract create(ban: BlogUserBanModel): Promise<string | undefined>;
  public abstract delete(blogId: string, userId: string): Promise<boolean>;
}
