import { Injectable } from '@nestjs/common';
import { Blog } from '../typeorm/models/blog';

@Injectable()
export default abstract class BlogsRepository {
  public abstract get(id: string): Promise<Blog | undefined>;
  public abstract create(blog: Blog): Promise<string | undefined>;
  public abstract update(model: Blog): Promise<boolean>;
  public abstract delete(id: string): Promise<boolean>;
}
