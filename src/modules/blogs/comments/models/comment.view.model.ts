import { LikesInfoModel } from '../../likes/models/likes.info.model';

export default class CommentViewModel {
  constructor(
    public id: string,
    public content: string,
    public userId: string,
    public userLogin: string,
    public createdAt: string,
    public likesInfo: LikesInfoModel = new LikesInfoModel(),
  ) { }
}
