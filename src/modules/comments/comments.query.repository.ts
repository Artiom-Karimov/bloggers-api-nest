import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import PageViewModel from '../../common/models/page.view.model';
import CommentMapper from './models/comment.mapper';
import Comment, { CommentDocument } from './models/comment.schema';
import CommentViewModel from './models/comment.view.model';
import GetCommentsQuery from './models/get.comments.query';

@Injectable()
export default class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private readonly model: Model<CommentDocument>,
  ) { }

  public async getComments(
    params: GetCommentsQuery,
  ): Promise<PageViewModel<CommentViewModel>> {
    const page = await this.getPage(params);
    const query = this.getDbQuery(params);
    return this.loadPageComments(page, query);
  }
  public async getComment(id: string): Promise<CommentViewModel | undefined> {
    try {
      const result = await this.model.findOne({ _id: id });
      return result ? CommentMapper.toView(result) : undefined;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  private async getPage(
    params: GetCommentsQuery,
  ): Promise<PageViewModel<CommentViewModel>> {
    const count = await this.getCount(params.postId);
    return new PageViewModel<CommentViewModel>(
      params.pageNumber,
      params.pageSize,
      count,
    );
  }
  private async getCount(postId: string): Promise<number> {
    try {
      return this.model.countDocuments({ postId }).exec();
    } catch (error) {
      return 0;
    }
  }
  private getDbQuery(params: GetCommentsQuery): any {
    return this.model
      .find({ postId: params.postId })
      .sort({ [params.sortBy]: params.sortDirection as SortOrder });
  }
  private async loadPageComments(
    page: PageViewModel<CommentViewModel>,
    query: any,
  ): Promise<PageViewModel<CommentViewModel>> {
    try {
      const comments: Comment[] = await query
        .skip(page.calculateSkip())
        .limit(page.pageSize)
        .exec();
      const viewModels = comments.map((b) => CommentMapper.toView(b));
      return page.add(...viewModels);
    } catch (error) {
      return page;
    }
  }
}
