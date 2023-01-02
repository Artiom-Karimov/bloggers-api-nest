import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostLike } from './models/post.like';
import { PostLikeRepository } from '../interfaces/post.like.repository';

@Injectable()
export class OrmPostLikeRepository extends PostLikeRepository {
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
