import { LikeStatus } from '../../../likes/models/like.input.model';
import { ExtendedLikesInfoModel } from '../../../likes/models/likes.info.model';
import PostViewModel from '../../models/post.view.model';
import { Post } from './post';

export default class PostMapper {
  public static toView(
    model: Post,
    likes: ExtendedLikesInfoModel,
  ): PostViewModel {
    likes.likesCount = Number(likes.likesCount);
    likes.dislikesCount = Number(likes.dislikesCount);
    if (likes.myStatus == null) likes.myStatus = LikeStatus.None;
    if (!likes.newestLikes) likes.newestLikes = [];
    if (!(likes.newestLikes instanceof Array)) {
      likes.newestLikes = [likes.newestLikes];
    }

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
