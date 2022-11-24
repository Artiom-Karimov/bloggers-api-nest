import { Injectable } from '@nestjs/common';
import { BlogOwnerInfo } from '../blogs/models/blog.model';
import BlogsRepository from './blogs.repository';
import { BlogError } from './models/blog.error';

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
}
