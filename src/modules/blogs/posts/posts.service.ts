import { Injectable } from '@nestjs/common';
import PostLikesRepository from '../likes/post.likes.repository';

@Injectable()
export default class PostsService {
  constructor(private readonly likeRepo: PostLikesRepository) { }

  public async setUserBanned(userId: string, isBanned: boolean): Promise<void> {
    await this.likeRepo.setUserBanned(userId, isBanned);
  }
}
