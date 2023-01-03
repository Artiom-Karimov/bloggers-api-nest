import { Injectable } from '@nestjs/common';
import { Post } from '../../posts/typeorm/models/post';
import PostViewModel from '../../posts/models/post.view.model';

@Injectable()
export abstract class PostLikesQueryRepository {
  abstract mergeWithLikes(post: Post, userId?: string): Promise<PostViewModel>;
  abstract mergeManyWithLikes(
    posts: Post[],
    userId?: string,
  ): Promise<PostViewModel[]>;
}
