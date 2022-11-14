import { Injectable } from '@nestjs/common';
import PostLikesRepository from '../likes/post.likes.repository';
import LikeInputModel from '../models/likes/like.input.model';
import LikeModel from '../models/likes/like.model';
import PostInputModel from '../models/posts/post.input.model';
import PostModel from '../models/posts/post.model';
import PostsRepository from './posts.repository';

@Injectable()
export default class PostsService {
  constructor(
    private readonly repo: PostsRepository,
    private readonly likeRepo: PostLikesRepository,
  ) { }

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
  public async putLike(data: LikeInputModel): Promise<boolean> {
    const post = await this.get(data.entityId);
    if (!post) return false;

    let like = await this.likeRepo.get(data.entityId, data.userId);
    if (like) {
      like = LikeModel.update(like, data.likeStatus);
      return this.likeRepo.update(like);
    }
    like = LikeModel.create(data);
    return this.likeRepo.create(like);
  }
}
