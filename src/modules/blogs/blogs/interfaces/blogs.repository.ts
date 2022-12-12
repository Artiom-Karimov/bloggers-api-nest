import { Injectable } from '@nestjs/common';
import BlogModel from '../models/blog.model';

@Injectable()
export default abstract class BlogsRepository {
  public abstract get(id: string): Promise<BlogModel | undefined>;
  public abstract create(blog: BlogModel): Promise<string | undefined>;
  public abstract update(model: BlogModel): Promise<boolean>;
  public abstract delete(id: string): Promise<boolean>;
}
