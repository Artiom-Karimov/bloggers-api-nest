import { LikeStatus } from '../../../likes/models/like.input.model';
import { ExtendedLikesInfoModel } from '../../../likes/models/likes.info.model';
import PostDto from '../../models/post.dto';
import PostModel from '../../models/post.model';
import PostViewModel from '../../models/post.view.model';
import Post from './post';

export default class PostMapper {
  public static fromDomain(model: PostModel): Post {
    const dto = model.toDto();
    return new Post(
      dto.id,
      dto.blogId,
      dto.blogName,
      dto.blogBanned,
      dto.title,
      dto.shortDescription,
      dto.content,
      new Date(dto.createdAt),
    );
  }
  public static toDomain(model: Post): PostModel {
    return new PostModel(
      new PostDto(
        model.id,
        model.title,
        model.shortDescription,
        model.content,
        model.blogId,
        model.blogName,
        model.createdAt.toISOString(),
        model.blogBanned,
      ),
    );
  }
  public static toView(model: Post & ExtendedLikesInfoModel): PostViewModel {
    return new PostViewModel(
      model.id,
      model.title,
      model.shortDescription,
      model.content,
      model.blogId,
      model.blogName,
      model.createdAt.toISOString(),
      new ExtendedLikesInfoModel(
        +model.likesCount,
        +model.dislikesCount,
        model.myStatus ?? LikeStatus.None,
        model.newestLikes ?? [],
      ),
    );
  }
}
