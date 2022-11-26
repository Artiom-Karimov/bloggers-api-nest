import DateGenerator from '../../../../common/utils/date.generator';
import IdGenerator from '../../../../common/utils/id.generator';
import CommentCreateModel from './comment.create.model';

export default class CommentModel {
  constructor(
    public id: string,
    public postId: string,
    public userId: string,
    public userLogin: string,
    public userBanned: boolean,
    public content: string,
    public createdAt: string,
  ) { }

  public static create(data: CommentCreateModel): CommentModel {
    return new CommentModel(
      IdGenerator.generate(),
      data.postId,
      data.userId,
      data.userLogin,
      false,
      data.content,
      DateGenerator.generate(),
    );
  }
}
