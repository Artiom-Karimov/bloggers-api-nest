import { Injectable } from '@nestjs/common';
import LikeModel from '../likes/models/like.model';

@Injectable()
export default abstract class LikesRepository {
  public abstract get(entityId: string, userId: string): Promise<LikeModel>;
  public abstract create(data: LikeModel): Promise<boolean>;
  public abstract update(data: LikeModel): Promise<boolean>;
  public abstract setUserBanned(
    userId: string,
    userBanned: boolean,
  ): Promise<void>;
}
