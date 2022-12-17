import { LikesInfoModel } from '../../../likes/models/likes.info.model';
import CommentDto from '../../models/comment.dto';
import CommentModel from '../../models/comment.model';
import Comment from './comment';
import BloggerCommentViewModel from '../../models/view/blogger.comment.view.model';
import CommentViewModel from '../../models/view/comment.view.model';
import CommentWithPost from './comment.with.post';
import { LikeStatus } from '../../../likes/models/like.input.model';

export default class CommentMapper {
  public static fromDomain(model: CommentModel): Comment {
    const dto = model.toDto();
    return new Comment(
      dto.id,
      dto.postId,
      dto.userId,
      dto.userLogin,
      dto.bannedByAdmin,
      dto.bannedByBlogger,
      dto.content,
      new Date(dto.createdAt),
    );
  }
  public static toDomain(model: Comment): CommentModel {
    return new CommentModel(
      new CommentDto(
        model.id,
        model.postId,
        model.userId,
        model.userLogin,
        model.bannedByAdmin,
        model.bannedByBlogger,
        model.content,
        model.createdAt.toISOString(),
      ),
    );
  }
  public static toView(model: Comment & LikesInfoModel): CommentViewModel {
    return new CommentViewModel(
      model.id,
      model.content,
      model.userId,
      model.userLogin,
      model.createdAt.toISOString(),
      new LikesInfoModel(
        +model.likesCount,
        +model.dislikesCount,
        model.myStatus ?? LikeStatus.None,
      ),
    );
  }
  public static toBloggerView(
    model: CommentWithPost & LikesInfoModel,
  ): BloggerCommentViewModel {
    return new BloggerCommentViewModel(CommentMapper.toView(model), {
      id: model.postId,
      title: model.postTitle,
      blogId: model.blogId,
      blogName: model.blogName,
    });
  }
}
