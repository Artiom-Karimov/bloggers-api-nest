import { Injectable } from '@nestjs/common';
import PageViewModel from '../../../../common/models/page.view.model';
import BloggerCommentsQueryRepository from '../blogger.comments.query.repository';
import GetBloggerCommentsQuery from '../models/input/get.blogger.comments.query';
import BloggerCommentViewModel from '../models/view/blogger.comment.view.model';

@Injectable()
export default class SqlBloggerCommentsQueryRepository extends BloggerCommentsQueryRepository {
  public async getBloggerComments(
    params: GetBloggerCommentsQuery,
  ): Promise<PageViewModel<BloggerCommentViewModel>> {
    throw new Error('Not implemented');
  }
}
