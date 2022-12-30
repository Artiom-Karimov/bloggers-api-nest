import { Injectable } from '@nestjs/common';
import { Blog } from '../typeorm/models/blog';
import BlogsRepository from '../interfaces/blogs.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrmBlogsRepository extends BlogsRepository {
  constructor(
    @InjectRepository(Blog)
    private readonly repo: Repository<Blog>,
  ) {
    super();
  }

  public async get(id: string): Promise<Blog | undefined> {
    try {
      const user = await this.repo.findOne({ where: { id } });
      return user ?? undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async create(blog: Blog): Promise<string | undefined> {
    try {
      const result = await this.repo.save(blog);
      return result.id;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async update(model: Blog): Promise<boolean> {
    return !!(await this.create(model));
  }
  public async delete(id: string): Promise<boolean> {
    try {
      const result = await this.repo.delete(id);
      return !!result.affected;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
