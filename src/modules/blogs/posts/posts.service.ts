import { Injectable } from '@nestjs/common';
import PostLikesRepository from '../likes/post.likes.repository';
import PostsRepository from './posts.repository';

@Injectable()
export default class PostsService {
  constructor(
    private readonly repo: PostsRepository,
    private readonly likeRepo: PostLikesRepository,
  ) { }

  public async setUserBanned(
    userId: string,
    userBanned: boolean,
  ): Promise<void> {
    await this.likeRepo.setUserBanned(userId, userBanned);
  }
}
