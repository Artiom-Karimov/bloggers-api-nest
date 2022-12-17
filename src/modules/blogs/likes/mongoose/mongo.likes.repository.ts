import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import LikesRepository from '../likes.repository';
import { LikeDocument } from './models/like.schema';
import LikeModel from '../models/like.model';
import LikeMapper from './models/like.mapper';

@Injectable()
export default class MongoLikesRepository extends LikesRepository {
  constructor(protected readonly model: Model<LikeDocument>) {
    super();
  }

  public async get(entityId: string, userId: string): Promise<LikeModel> {
    try {
      const result = await this.model.findOne({ entityId, userId });
      return result ? LikeMapper.toDomain(result) : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async create(data: LikeModel): Promise<boolean> {
    try {
      const like = new this.model(LikeMapper.fromDomain(data));
      await like.save();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  public async update(data: LikeModel): Promise<boolean> {
    try {
      const like = LikeMapper.fromDomain(data);
      await this.model.findByIdAndUpdate(like._id, like);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  public async setUserBanned(
    userId: string,
    userBanned: boolean,
  ): Promise<void> {
    try {
      await this.model.updateMany({ userId }, { userBanned }).exec();
    } catch (error) {
      console.error(error);
    }
  }
}
