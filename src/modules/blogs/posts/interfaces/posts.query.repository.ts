import { Injectable } from '@nestjs/common';
import PageViewModel from '../../../../common/models/page.view.model';
import GetPostsQuery from '../models/get.posts.query';
import PostViewModel from '../models/post.view.model';

@Injectable()
export default abstract class PostsQueryRepository {
  public abstract getPosts(
    params: GetPostsQuery,
  ): Promise<PageViewModel<PostViewModel>>;
  public abstract getPost(
    id: string,
    userId: string | undefined,
  ): Promise<PostViewModel | undefined>;
}
