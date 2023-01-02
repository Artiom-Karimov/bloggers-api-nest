import { LikesInfoModel } from '../../../likes/models/likes.info.model';
import BloggerCommentViewModel from '../../models/view/blogger.comment.view.model';
import CommentViewModel from '../../models/view/comment.view.model';
import { Comment } from './comment';

export default class CommentMapper {
  public static toView(
    model: Comment,
    likes: LikesInfoModel,
  ): CommentViewModel {
    return new CommentViewModel(
      model.id,
      model.content,
      model.userId,
      model.userLogin,
      model.createdAt.toISOString(),
      likes,
    );
  }
  public static toBloggerView(
    model: Comment,
    likes: LikesInfoModel,
  ): BloggerCommentViewModel {
    return new BloggerCommentViewModel(CommentMapper.toView(model, likes), {
      id: model.postId,
      title: model.post.title,
      blogId: model.post.blogId,
      blogName: model.post.blogName,
    });
  }
}
