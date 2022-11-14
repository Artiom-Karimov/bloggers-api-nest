import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import LikeMapper from '../models/likes/like.mapper';
import LikeModel from '../models/likes/like.model';
import { LikeDocument } from '../models/likes/like.schema';

@Injectable()
export default class LikesRepository {
  constructor(protected readonly model: Model<LikeDocument>) { }

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
      const result = await this.model.findByIdAndUpdate(data.id, like);
      return result.isModified();
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  public async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id);
      return result.$isDeleted();
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
