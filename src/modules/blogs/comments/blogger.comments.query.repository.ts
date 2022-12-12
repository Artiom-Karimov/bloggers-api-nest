import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import PageViewModel from '../../../common/models/page.view.model';
import CommentLikesQueryRepository from '../likes/comment.likes.query.repository';
import CommentMapper from '../comments/models/comment.mapper';
import Comment, { CommentDocument } from '../comments/models/comment.schema';
import Post from '../posts/mongoose/models/post.schema';
import BloggerCommentViewModel from './models/view/blogger.comment.view.model';
import GetBloggerCommentsQuery from './models/input/get.blogger.comments.query';
import Blog, { BlogDocument } from '../blogs/mongoose/models/blog.schema';

@Injectable()
export default class BloggerCommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private readonly model: Model<CommentDocument>,
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    private readonly likesQueryRepo: CommentLikesQueryRepository,
  ) { }

  public async getBloggerComments(
    params: GetBloggerCommentsQuery,
  ): Promise<PageViewModel<BloggerCommentViewModel>> {
    const blogs = await this.getBlogList(params.bloggerId);
    const page = await this.getPage(blogs, params);
    const query = this.getDbQuery(blogs, params);
    return this.loadPageComments(page, query, params.bloggerId);
  }

  private async getBlogList(bloggerId: string): Promise<string[]> {
    try {
      const result = await this.blogModel
        .find({ 'ownerInfo.userId': bloggerId })
        .select('_id');
      return result.map((b) => b._id);
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  private async getPage(
    blogIds: string[],
    params: GetBloggerCommentsQuery,
  ): Promise<PageViewModel<BloggerCommentViewModel>> {
    const count = await this.getCount(blogIds);
    return new PageViewModel<BloggerCommentViewModel>(
      params.pageNumber,
      params.pageSize,
      count,
    );
  }
  private async getCount(blogIds: string[]): Promise<number> {
    try {
      return this.model
        .countDocuments({})
        .populate({ path: 'postId', match: { blogId: { $in: blogIds } } })
        .where({ bannedByAdmin: false, bannedByBlogger: false })
        .exec();
    } catch (error) {
      console.error(error);
      return 0;
    }
  }
  private getDbQuery(blogIds: string[], params: GetBloggerCommentsQuery): any {
    return this.model
      .find({})
      .populate({ path: 'postId', match: { blogId: { $in: blogIds } } })
      .where({ bannedByAdmin: false, bannedByBlogger: false })
      .sort({ [params.sortBy]: params.sortDirection as SortOrder });
  }
  private async loadPageComments(
    page: PageViewModel<BloggerCommentViewModel>,
    query: any,
    userId: string | undefined,
  ): Promise<PageViewModel<BloggerCommentViewModel>> {
    try {
      const comments: any[] = await query
        .skip(page.calculateSkip())
        .limit(page.pageSize)
        .exec();
      const viewModels = await this.mergeManyWithLikes(comments, userId);
      return page.add(...viewModels);
    } catch (error) {
      console.error(error);
      return page;
    }
  }
  private async mergeManyWithLikes(
    comments: any[],
    userId: string | undefined,
  ): Promise<BloggerCommentViewModel[]> {
    const promises = comments.map((c) =>
      this.mergeWithLikes(c, c.postId, userId),
    );
    return Promise.all(promises);
  }
  private async mergeWithLikes(
    comment: Comment,
    post: Post,
    bloggerId: string | undefined,
  ): Promise<BloggerCommentViewModel> {
    const likeInfo = await this.likesQueryRepo.getLikesInfo(
      comment._id,
      bloggerId,
    );
    return CommentMapper.toBloggerView(comment, likeInfo, post);
  }
}
