import { Injectable } from '@nestjs/common';
import BlogInputModel from '../blogs/models/blog.input.model';
import BlogModel, { BlogOwnerInfo } from '../blogs/models/blog.model';
import BlogsRepository from './blogs.repository';

export enum BlogError {
  NoError,
  NotFound,
  Forbidden,
  Unknown,
}

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
  public async createForBlogger(data: BlogInputModel, blogger: BlogOwnerInfo) {
    const newBlog = BlogModel.create(data, blogger);
    return this.repo.create(newBlog);
  }
  public async assignOwner(
    blogId: string,
    ownerInfo: BlogOwnerInfo,
  ): Promise<BlogError> {
    const blog = await this.repo.get(blogId);
    if (!blog) return BlogError.NotFound;
    if (blog.ownerInfo) return BlogError.Forbidden;
    const result = await this.repo.update(blogId, { ownerInfo });
    return result ? BlogError.NoError : BlogError.Unknown;
  }
  public async update(id: string, data: BlogInputModel): Promise<boolean> {
    const blog = await this.repo.get(id);
    if (!blog) return false;
    return this.repo.update(id, data);
  }
  public async updateForBlogger(
    id: string,
    data: BlogInputModel,
    bloggerId: string,
  ): Promise<BlogError> {
    const blog = await this.repo.get(id);
    if (!blog) return BlogError.NotFound;
    if (!blog.ownerInfo || blog.ownerInfo.userId !== bloggerId)
      return BlogError.Forbidden;
    const result = await this.repo.update(id, data);
    return result ? BlogError.NoError : BlogError.Unknown;
  }
  public async delete(id: string): Promise<boolean> {
    const blog = await this.repo.get(id);
    if (!blog) return false;
    return this.repo.delete(id);
  }
  public async deleteForBlogger(
    blogId: string,
    bloggerId: string,
  ): Promise<BlogError> {
    const blog = await this.repo.get(blogId);
    if (!blog) return BlogError.NotFound;
    if (!blog.ownerInfo || blog.ownerInfo.userId !== bloggerId)
      return BlogError.Forbidden;
    const result = await this.repo.delete(blogId);
    return result ? BlogError.NoError : BlogError.Unknown;
  }
}
