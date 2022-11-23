import { LikeStatus } from './like.input.model';
import LikeModel from './like.model';
import { Like } from './like.schema';
import { LikeViewModel } from './likes.info.model';

export default class LikeMapper {
  public static fromDomain(model: LikeModel): Like {
    return new Like(
      model.id,
      model.entityId,
      model.userId,
      model.userLogin,
      model.userBanned,
      model.status,
      model.lastModified,
    );
  }
  public static toDomain(model: Like): LikeModel {
    return new LikeModel(
      model._id,
      model.entityId,
      model.userId,
      model.userLogin,
      model.userBanned,
      model.status as LikeStatus,
      model.lastModified,
    );
  }
  public static toView(model: Like): LikeViewModel {
    return new LikeViewModel(model.lastModified, model.userId, model.userLogin);
  }
}
