import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import PageViewModel from '../../../../common/models/page.view.model';
import CommentLikesQueryRepository from '../../likes/comment.likes.query.repository';
import CommentsQueryRepository from '../comments.query.repository';
import CommentMapper from './models/comment.mapper';
import Comment, { CommentDocument } from './models/comment.schema';
import GetCommentsQuery from '../models/input/get.comments.query';
import CommentViewModel from '../models/view/comment.view.model';

@Injectable()
export default class MongoCommentsQueryRepository extends CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private readonly model: Model<CommentDocument>,
    private readonly likesQueryRepo: CommentLikesQueryRepository,
  ) {
    super();
  }

  public async getComments(
    params: GetCommentsQuery,
  ): Promise<PageViewModel<CommentViewModel>> {
    const page = await this.getPage(params);
    const query = this.getDbQuery(params);
    return this.loadPageComments(page, query, params.userId);
  }
  public async getComment(
    id: string,
    userId: string | undefined,
  ): Promise<CommentViewModel | undefined> {
    try {
      const result = await this.model.findOne({ _id: id });
      if (!result || result.bannedByAdmin || result.bannedByBlogger)
        return undefined;
      return this.mergeWithLikes(result, userId);
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
      return this.model
        .countDocuments({ postId })
        .where({ bannedByAdmin: false, bannedByBlogger: false })
        .exec();
    } catch (error) {
      return 0;
    }
  }
  private getDbQuery(params: GetCommentsQuery): any {
    return this.model
      .find({ postId: params.postId })
      .where({ bannedByAdmin: false, bannedByBlogger: false })
      .sort({ [params.sortBy]: params.sortDirection as SortOrder });
  }
  private async loadPageComments(
    page: PageViewModel<CommentViewModel>,
    query: any,
    userId: string | undefined,
  ): Promise<PageViewModel<CommentViewModel>> {
    try {
      const comments: Comment[] = await query
        .skip(page.calculateSkip())
        .limit(page.pageSize)
        .exec();
      const viewModels = await this.mergeManyWithLikes(comments, userId);
      return page.add(...viewModels);
    } catch (error) {
      return page;
    }
  }
  private async mergeManyWithLikes(
    comments: Comment[],
    userId: string | undefined,
  ): Promise<CommentViewModel[]> {
    const promises = comments.map((c) => this.mergeWithLikes(c, userId));
    return Promise.all(promises);
  }
  private async mergeWithLikes(
    post: Comment,
    userId: string | undefined,
  ): Promise<CommentViewModel> {
    const likeInfo = await this.likesQueryRepo.getLikesInfo(post._id, userId);
    return CommentMapper.toView(post, likeInfo);
  }
}
