import IdGenerator from '../../../../common/utils/id.generator';
import LikeInputModel, { LikeStatus } from './like.input.model';

export default class LikeModel {
  constructor(
    public id: string,
    public entityId: string,
    public userId: string,
    public userLogin: string,
    public status: LikeStatus,
    public lastModified: string,
  ) { }
  public static create(data: LikeInputModel): LikeModel {
    return new LikeModel(
      IdGenerator.generate(),
      data.entityId,
      data.userId,
      data.userLogin,
      data.likeStatus,
      new Date().toISOString(),
    );
  }
  public static update(model: LikeModel, status: LikeStatus): LikeModel {
    model.status = status;
    model.lastModified = new Date().toISOString();
    return model;
  }
}
