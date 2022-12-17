import LikeDto from '../../models/like.dto';
import { LikeStatus } from '../../models/like.input.model';
import LikeModel from '../../models/like.model';
import { LikeViewModel } from '../../models/likes.info.model';
import Like from './like';

export default class LikeMapper {
  public static fromDomain(model: LikeModel): Like {
    const dto = model.toDto();
    return new Like(
      dto.entityId,
      dto.userId,
      dto.userLogin,
      dto.userBanned,
      dto.status,
      new Date(dto.lastModified),
    );
  }
  public static toDomain(model: Like): LikeModel {
    return new LikeModel(
      new LikeDto(
        model.entityId + model.userId,
        model.entityId,
        model.userId,
        model.userLogin,
        model.userBanned,
        model.status as LikeStatus,
        model.lastModified.toISOString(),
      ),
    );
  }
  public static toView(model: Like): LikeViewModel {
    return new LikeViewModel(
      model.lastModified.toISOString(),
      model.userId,
      model.userLogin,
    );
  }
}
