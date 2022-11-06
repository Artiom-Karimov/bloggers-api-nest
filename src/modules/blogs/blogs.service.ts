import { Injectable } from '@nestjs/common';
import BlogsRepository from './blogs.repository';
import BlogInputModel from './models/blog.input.model';
import BlogModel from './models/blog.model';

@Injectable()
export default class BlogsService {
  constructor(private readonly repo: BlogsRepository) { }
  public async get(id: string): Promise<BlogModel | undefined> {
    return this.repo.get(id);
  }
  public async create(data: BlogInputModel): Promise<string | undefined> {
    const newBlog = BlogModel.create(data);
    return this.repo.create(newBlog);
  }
  public async update(id: string, data: BlogInputModel): Promise<boolean> {
    const blog = await this.repo.get(id);
    if (!blog) return false;
    return this.repo.update(id, data);
  }
  public async delete(id: string): Promise<boolean> {
    const blog = await this.repo.get(id);
    if (!blog) return false;
    return this.repo.delete(id);
  }
}
