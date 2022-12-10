import { LikesInfoModel } from '../../likes/models/likes.info.model';
import Post from '../../posts/models/post.schema';
import CommentDto from './comment.dto';
import CommentModel from './comment.model';
import Comment from './comment.schema';
import BloggerCommentViewModel from './view/blogger.comment.view.model';
import CommentViewModel from './view/comment.view.model';

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
      dto.createdAt,
    );
  }
  public static toDomain(model: Comment): CommentModel {
    return new CommentModel(
      new CommentDto(
        model._id,
        model.postId,
        model.userId,
        model.userLogin,
        model.bannedByAdmin,
        model.bannedByBlogger,
        model.content,
        model.createdAt,
      ),
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
  public static toBloggerView(
    model: Comment,
    likesInfo: LikesInfoModel | undefined,
    postModel: Post,
  ): BloggerCommentViewModel {
    return new BloggerCommentViewModel(CommentMapper.toView(model, likesInfo), {
      id: postModel._id,
      title: postModel.title,
      blogId: postModel.blogId,
      blogName: postModel.blogName,
    });
  }
}
