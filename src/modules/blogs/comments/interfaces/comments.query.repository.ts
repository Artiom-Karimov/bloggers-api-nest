import { Injectable } from '@nestjs/common';
import PageViewModel from '../../../../common/models/page.view.model';
import CommentViewModel from '../models/view/comment.view.model';
import GetCommentsQuery from '../models/input/get.comments.query';

@Injectable()
export default abstract class CommentsQueryRepository {
  public abstract getComments(
    params: GetCommentsQuery,
  ): Promise<PageViewModel<CommentViewModel>>;
  public abstract getComment(
    id: string,
    userId: string | undefined,
  ): Promise<CommentViewModel | undefined>;
}
