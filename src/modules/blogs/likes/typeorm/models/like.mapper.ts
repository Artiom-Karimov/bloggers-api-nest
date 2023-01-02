import { LikeViewModel } from '../../models/likes.info.model';
import { Like } from './like';

export default class LikeMapper {
  public static toView(model: Like): LikeViewModel {
    return new LikeViewModel(
      model.lastModified.toISOString(),
      model.userId,
      model.userLogin,
    );
  }
}
