import { ExtendedLikesInfoModel } from '../../../likes/models/likes.info.model';
import PostDto from '../../models/post.dto';
import PostModel from '../../models/post.model';
import Post from './post.schema';
import PostViewModel from '../../models/post.view.model';

export default class PostMapper {
  public static fromDomain(model: PostModel): Post {
    const dto = model.toDto();
    return new Post(
      dto.id,
      dto.title,
      dto.shortDescription,
      dto.content,
      dto.blogId,
      dto.blogName,
      dto.createdAt,
      dto.blogBanned,
    );
  }
  public static toDomain(model: Post): PostModel {
    return new PostModel(
      new PostDto(
        model._id,
        model.title,
        model.shortDescription,
        model.content,
        model.blogId,
        model.blogName,
        model.createdAt,
        model.blogBanned,
      ),
    );
  }
  public static toView(
    model: Post,
    likesInfo: ExtendedLikesInfoModel,
  ): PostViewModel {
    return new PostViewModel(
      model._id,
      model.title,
      model.shortDescription,
      model.content,
      model.blogId,
      model.blogName,
      model.createdAt,
      likesInfo,
    );
  }
}
