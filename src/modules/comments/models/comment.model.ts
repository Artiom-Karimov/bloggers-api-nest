import DateGenerator from '../../../common/utils/date.generator';
import IdGenerator from '../../../common/utils/id.generator';

export type CommentInputModel = {
  postId: string;
  userId: string;
  userLogin: string;
  content: string;
};

export default class CommentModel {
  constructor(
    public id: string,
    public postId: string,
    public userId: string,
    public userLogin: string,
    public content: string,
    public createdAt: string,
  ) { }

  public static create(data: CommentInputModel): CommentModel {
    return new CommentModel(
      IdGenerator.generate(),
      data.postId,
      data.userId,
      data.userLogin,
      data.content,
      DateGenerator.generate(),
    );
  }
}
