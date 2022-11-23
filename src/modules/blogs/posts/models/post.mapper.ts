import { ExtendedLikesInfoModel } from '../../likes/models/likes.info.model';
import PostModel from './post.model';
import Post from './post.schema';
import PostViewModel from './post.view.model';

export default class PostMapper {
  public static fromDomain(model: PostModel): Post {
    const post = new Post();
    post._id = model.id;
    post.title = model.title;
    post.shortDescription = model.shortDescription;
    post.content = model.content;
    post.blogId = model.blogId;
    post.blogName = model.blogName;
    post.createdAt = model.createdAt;
    return post;
  }
  public static toDomain(model: Post): PostModel {
    return new PostModel(
      model._id,
      model.title,
      model.shortDescription,
      model.content,
      model.blogId,
      model.blogName,
      model.createdAt,
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
