import { Injectable } from '@nestjs/common';
import BlogsRepository from './blogs.repository';
import BlogModel, { BlogInputModel } from './models/blog.model';

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
    return this.repo.update(id, data);
  }
  public async delete(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}
