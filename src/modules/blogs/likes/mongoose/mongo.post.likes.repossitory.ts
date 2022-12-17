import { Injectable } from '@nestjs/common';
import PostLikesRepository from '../post.likes.repository';
import MongoLikesRepository from './mongo.likes.repository';
import { Model } from 'mongoose';
import { LikeDocument, PostLike } from './models/like.schema';
import LikeModel from '../models/like.model';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export default class MongoPostLikesRepository extends PostLikesRepository {
  private readonly repo: MongoLikesRepository;
  constructor(@InjectModel(PostLike.name) model: Model<LikeDocument>) {
    super();
    this.repo = new MongoLikesRepository(model);
  }

  public async get(entityId: string, userId: string): Promise<LikeModel> {
    return this.repo.get(entityId, userId);
  }
  public async create(data: LikeModel): Promise<boolean> {
    return this.repo.create(data);
  }
  public async update(data: LikeModel): Promise<boolean> {
    return this.repo.update(data);
  }
  public async setUserBanned(
    userId: string,
    userBanned: boolean,
  ): Promise<void> {
    return this.repo.setUserBanned(userId, userBanned);
  }
}
