import { LikesInfoModel } from '../../../likes/models/likes.info.model';
import CommentDto from '../../models/comment.dto';
import CommentModel from '../../models/comment.model';
import Comment from './comment';
import BloggerCommentViewModel from '../../models/view/blogger.comment.view.model';
import CommentViewModel from '../../models/view/comment.view.model';
import PostDto from '../../../posts/models/post.dto';

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
  public static toView(
    model: Comment,
    likesInfo: LikesInfoModel | undefined,
  ): CommentViewModel {
    return new CommentViewModel(
      model.id,
      model.content,
      model.userId,
      model.userLogin,
      model.createdAt.toISOString(),
      likesInfo,
    );
  }
  public static toBloggerView(
    model: Comment,
    likesInfo: LikesInfoModel | undefined,
    postModel: PostDto,
  ): BloggerCommentViewModel {
    return new BloggerCommentViewModel(CommentMapper.toView(model, likesInfo), {
      id: postModel.id,
      title: postModel.title,
      blogId: postModel.blogId,
      blogName: postModel.blogName,
    });
  }
}
