import { ExtendedLikesInfoModel } from '../../../likes/models/likes.info.model';
import PostViewModel from '../../models/post.view.model';
import { Post } from './post';

export default class PostMapper {
  public static toView(
    model: Post,
    likes: ExtendedLikesInfoModel,
  ): PostViewModel {
    return new PostViewModel(
      model.id,
      model.title,
      model.shortDescription,
      model.content,
      model.blogId,
      model.blogName,
      model.createdAt.toISOString(),
      likes,
    );
  }
}
