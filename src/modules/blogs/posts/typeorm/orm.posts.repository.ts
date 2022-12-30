import { Injectable } from '@nestjs/common';
import PostsRepository from '../interfaces/posts.repository';
import { Post } from './models/post';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrmPostsRepository extends PostsRepository {
  constructor(
    @InjectRepository(Post)
    private readonly repo: Repository<Post>,
  ) {
    super();
  }

  public async get(id: string): Promise<Post | undefined> {
    try {
      const post = await this.repo.findOne({ where: { id } });
      return post ?? undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async create(post: Post): Promise<string | undefined> {
    try {
      const result = await this.repo.save(post);
      return result.id;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async update(model: Post): Promise<boolean> {
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
