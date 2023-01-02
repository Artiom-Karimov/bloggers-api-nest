import { PostLike } from '../typeorm/models/post.like';

export abstract class PostLikeRepository {
  abstract put(like: PostLike): Promise<boolean>;
}
