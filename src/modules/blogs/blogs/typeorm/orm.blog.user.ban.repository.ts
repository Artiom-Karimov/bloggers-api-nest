import { Injectable } from '@nestjs/common';
import { BlogUserBan } from '../typeorm/models/blog.user.ban';
import BlogUserBanRepository from '../interfaces/blog.user.ban.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrmBlogUserBanRepository extends BlogUserBanRepository {
  constructor(
    @InjectRepository(BlogUserBan)
    private readonly repo: Repository<BlogUserBan>,
  ) {
    super();
  }

  public async get(
    blogId: string,
    userId: string,
  ): Promise<BlogUserBan | undefined> {
    try {
      const user = await this.repo.findOne({ where: { blogId, userId } });
      return user ?? undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async create(ban: BlogUserBan): Promise<string | undefined> {
    try {
      const result = await this.repo.save(ban);
      return result.id;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async delete(blogId: string, userId: string): Promise<boolean> {
    try {
      const result = await this.repo.delete({ blogId, userId });
      return !!result.affected;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
