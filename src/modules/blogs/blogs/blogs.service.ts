import { Injectable } from '@nestjs/common';
import BlogInputModel from '../blogs/models/blog.input.model';
import { BlogOwnerInfo } from '../blogs/models/blog.model';
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
  public async update(
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
  public async delete(blogId: string, bloggerId: string): Promise<BlogError> {
    const blog = await this.repo.get(blogId);
    if (!blog) return BlogError.NotFound;
    if (!blog.ownerInfo || blog.ownerInfo.userId !== bloggerId)
      return BlogError.Forbidden;
    const result = await this.repo.delete(blogId);
    return result ? BlogError.NoError : BlogError.Unknown;
  }
}
