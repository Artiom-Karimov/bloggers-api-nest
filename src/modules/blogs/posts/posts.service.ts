import { Injectable } from '@nestjs/common';
import PostLikesRepository from '../likes/post.likes.repository';
import LikeInputModel from '../likes/models/like.input.model';
import LikeModel from '../likes/models/like.model';
import PostsRepository from './posts.repository';

@Injectable()
export default class PostsService {
  constructor(
    private readonly repo: PostsRepository,
    private readonly likeRepo: PostLikesRepository,
  ) { }

  public async putLike(data: LikeInputModel): Promise<boolean> {
    const post = await this.repo.get(data.entityId);
    if (!post) return false;

    let like = await this.likeRepo.get(data.entityId, data.userId);
    if (like) {
      like = LikeModel.update(like, data.likeStatus);
      return this.likeRepo.update(like);
    }
    like = LikeModel.create(data);
    return this.likeRepo.create(like);
  }
  public async setUserBanned(
    userId: string,
    userBanned: boolean,
  ): Promise<void> {
    await this.likeRepo.setUserBanned(userId, userBanned);
  }
}
