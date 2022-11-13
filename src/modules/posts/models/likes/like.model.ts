import IdGenerator from '../../../../common/utils/id.generator';
import LikeInputModel, { LikeStatus } from './like.input.model';

export default class LikeModel {
  constructor(
    public id: string,
    public entityId: string,
    public userId: string,
    public status: LikeStatus,
    public lastModified: number,
  ) { }
  public static create(data: LikeInputModel): LikeModel {
    return new LikeModel(
      IdGenerator.generate(),
      data.entityId,
      data.userId,
      data.likeStatus,
      new Date().getTime(),
    );
  }
  public static update(model: LikeModel, status: LikeStatus): LikeModel {
    model.status = status;
    model.lastModified = new Date().getTime();
    return model;
  }
}
