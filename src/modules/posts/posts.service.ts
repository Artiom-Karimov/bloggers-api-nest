import { Injectable } from '@nestjs/common';
import PostModel, { PostInputModel } from './models/post.model';
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
    return this.repo.update(id, data);
  }
  public async delete(id: string): Promise<boolean> {
    const deleted = await this.repo.delete(id);
    return deleted;
  }
}
