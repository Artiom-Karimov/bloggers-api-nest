import { Injectable } from '@nestjs/common';
import { Post } from '../typeorm/models/post';

@Injectable()
export default abstract class PostsRepository {
  public abstract get(id: string): Promise<Post | undefined>;
  public abstract create(post: Post): Promise<string | undefined>;
  public abstract update(model: Post): Promise<boolean>;
  public abstract delete(id: string): Promise<boolean>;
}
