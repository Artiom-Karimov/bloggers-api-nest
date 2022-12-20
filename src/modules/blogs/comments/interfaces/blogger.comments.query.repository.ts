import { Injectable } from '@nestjs/common';
import PageViewModel from '../../../../common/models/page.view.model';
import BloggerCommentViewModel from '../models/view/blogger.comment.view.model';
import GetBloggerCommentsQuery from '../models/input/get.blogger.comments.query';

@Injectable()
export default abstract class BloggerCommentsQueryRepository {
  public abstract getBloggerComments(
    params: GetBloggerCommentsQuery,
  ): Promise<PageViewModel<BloggerCommentViewModel>>;
}
