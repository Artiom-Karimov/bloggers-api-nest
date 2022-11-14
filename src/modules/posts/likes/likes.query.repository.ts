import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { LikeStatus } from '../models/likes/like.input.model';
import LikeMapper from '../models/likes/like.mapper';
import { Like, LikeDocument } from '../models/likes/like.schema';
import {
  ExtendedLikesInfoModel,
  LikesInfoModel,
  LikeViewModel,
} from '../models/likes/likes.info.model';

@Injectable()
export default class LikesQueryRepository {
  constructor(protected readonly model: Model<LikeDocument>) { }

  public async getExtendedLikesInfo(
    entityId: string,
    userId: string | undefined,
  ): Promise<ExtendedLikesInfoModel> {
    const info = await this.getLikesInfo(entityId, userId);
    const newestLikes = await this.getNewestLikes(entityId);
    return ExtendedLikesInfoModel.construct(info, newestLikes);
  }
  public async getLikesInfo(
    entityId: string,
    userId: string | undefined,
  ): Promise<LikesInfoModel> {
    try {
      return new LikesInfoModel(
        await this.getLikesCount(entityId),
        await this.getDislikesCount(entityId),
        await this.getUserLike(entityId, userId),
      );
    } catch (error) {
      return new LikesInfoModel();
    }
  }

  protected async getLikesCount(entityId: string): Promise<number> {
    return this.model
      .countDocuments({ entityId: entityId })
      .where('status')
      .equals('Like');
  }
  protected async getDislikesCount(entityId: string): Promise<number> {
    return this.model
      .countDocuments({ entityId: entityId })
      .where('status')
      .equals('Dislike');
  }
  protected async getUserLike(
    entityId: string,
    userId: string | undefined,
  ): Promise<LikeStatus> {
    if (!userId) return LikeStatus.None;
    try {
      const result = await this.model.findOne({
        entityId: entityId,
        userId: userId,
      });
      return result ? (result.status as LikeStatus) : LikeStatus.None;
    } catch (error) {
      return LikeStatus.None;
    }
  }
  protected async getNewestLikes(entityId: string): Promise<LikeViewModel[]> {
    const likes = await this.getDbNewestLikes(entityId);
    return likes.map((l) => LikeMapper.toView(l));
  }
  protected async getDbNewestLikes(entityId: string): Promise<Like[]> {
    try {
      return this.model
        .find({ entityId: entityId })
        .where('status')
        .equals('Like')
        .sort({ lastModified: -1 })
        .limit(3)
        .exec();
    } catch (error) {
      return [];
    }
  }
}
