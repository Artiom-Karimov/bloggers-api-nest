import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostLike } from './models/post.like';
import { LikesRepository } from '../interfaces/likes.repository';

@Injectable()
export class OrmPostLikeRepository extends LikesRepository<PostLike> {
  constructor(
    @InjectRepository(PostLike)
    private readonly repo: Repository<PostLike>,
  ) {
    super();
  }

  public async put(like: PostLike): Promise<boolean> {
    try {
      const result = await this.repo.save(like);
      return !!result;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
