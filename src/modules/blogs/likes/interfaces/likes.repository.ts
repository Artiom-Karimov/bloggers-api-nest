import { Injectable } from '@nestjs/common';
import { Like } from '../typeorm/models/like';

@Injectable()
export default abstract class LikesRepository {
  public abstract get(entityId: string, userId: string): Promise<Like>;
  public abstract create(data: Like): Promise<boolean>;
  public abstract update(data: Like): Promise<boolean>;
}
