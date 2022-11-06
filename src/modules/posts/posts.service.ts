import { Injectable } from '@nestjs/common';
import PostInputModel from './models/post.input.model';
import PostModel from './models/post.model';
import PostsRepository from './posts.repository';

@Injectable()
export default class PostsService {
  constructor(private readonly repo: PostsRepository) { }

  public async get(id: string): Promise<PostModel | undefined> {
    return this.repo.get(id);
  }
  public async create(data: PostInputModel): Promise<string | undefined> {
    const newPost = PostModel.create(data);
    return this.repo.create(newPost);
  }
  public async update(id: string, data: PostInputModel): Promise<boolean> {
    const post = await this.repo.get(id);
    if (!post) return false;
    return this.repo.update(id, data);
  }
  public async delete(id: string): Promise<boolean> {
    const post = await this.repo.get(id);
    if (!post) return false;
    const deleted = await this.repo.delete(id);
    return deleted;
  }
}
