import { LikesInfoModel } from '../../likes/models/likes.info.model';
import CommentModel from './comment.model';
import Comment from './comment.schema';
import CommentViewModel from './comment.view.model';

export default class CommentMapper {
  public static fromDomain(model: CommentModel): Comment {
    const comment = new Comment();
    comment._id = model.id;
    comment.postId = model.postId;
    comment.userId = model.userId;
    comment.userLogin = model.userLogin;
    comment.userBanned = model.userBanned;
    comment.content = model.content;
    comment.createdAt = model.createdAt;
    return comment;
  }
  public static toDomain(model: Comment): CommentModel {
    return new CommentModel(
      model._id,
      model.postId,
      model.userId,
      model.userLogin,
      model.userBanned,
      model.content,
      model.createdAt,
    );
  }
  public static toView(
    model: Comment,
    likesInfo: LikesInfoModel | undefined,
  ): CommentViewModel {
    return new CommentViewModel(
      model._id,
      model.content,
      model.userId,
      model.userLogin,
      model.createdAt,
      likesInfo,
    );
  }
}
