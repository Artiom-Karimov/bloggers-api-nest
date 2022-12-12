import { Injectable } from '@nestjs/common';
import PostModel from '../models/post.model';

@Injectable()
export default abstract class PostsRepository {
  public abstract get(id: string): Promise<PostModel | undefined>;
  public abstract create(post: PostModel): Promise<string | undefined>;
  public abstract update(model: PostModel): Promise<boolean>;
  public abstract delete(id: string): Promise<boolean>;
  public abstract setBlogBan(
    blogId: string,
    blogBanned: boolean,
  ): Promise<boolean>;
}
