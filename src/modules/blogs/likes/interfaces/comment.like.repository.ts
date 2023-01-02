import { CommentLike } from '../typeorm/models/comment.like';

export abstract class CommentLikeRepository {
  abstract put(like: CommentLike): Promise<boolean>;
}
