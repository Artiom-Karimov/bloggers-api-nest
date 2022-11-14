import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import PageViewModel from '../../../common/models/page.view.model';
import BlogMapper from '../../blogs/models/blog.mapper';
import Blog, { BlogDocument } from '../../blogs/models/blog.schema';
import BlogViewModel from '../../blogs/models/blog.view.model';
import GetPostsQuery from '../models/posts/get.posts.query';
import PostMapper from '../models/posts/post.mapper';
import Post, { PostDocument } from '../models/posts/post.schema';
import PostViewModel from '../models/posts/post.view.model';

@Injectable()
export default class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private readonly model: Model<PostDocument>,
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
  ) { }

  public async getPosts(
    params: GetPostsQuery,
  ): Promise<PageViewModel<PostViewModel>> {
    const page = await this.getPage(params);
    const query = this.getQuery(params);
    return this.loadPagePosts(page, query);
  }
  public async getPost(
    id: string,
    userId: string | undefined,
  ): Promise<PostViewModel | undefined> {
    try {
      const post = await this.model.findOne({ _id: id });
      return post ? this.mergeWithLikes(post) : undefined;
    } catch (error) {
      return undefined;
    }
  }
  public async getBlog(id: string): Promise<BlogViewModel | undefined> {
    try {
      const result = await this.blogModel.findOne({ _id: id });
      return result ? BlogMapper.toView(result) : undefined;
    } catch (error) {
      return undefined;
    }
  }

  private async getPage(
    params: GetPostsQuery,
  ): Promise<PageViewModel<PostViewModel>> {
    const count = await this.getCount(params.blogId);
    return new PageViewModel<PostViewModel>(
      params.pageNumber,
      params.pageSize,
      count,
    );
  }
  private getQuery(params: GetPostsQuery): any {
    const filter = this.getFilter(params.blogId);
    return this.model
      .find(filter)
      .sort({ [params.sortBy]: params.sortDirection as SortOrder });
  }
  private async getCount(blogId: string | null = null): Promise<number> {
    try {
      const filter = this.getFilter(blogId);
      return this.model.countDocuments(filter);
    } catch (error) {
      return 0;
    }
  }
  private getFilter(blogId: string | null = null): any {
    return blogId ? { blogId: blogId } : {};
  }
  private async loadPagePosts(
    page: PageViewModel<PostViewModel>,
    query: any,
  ): Promise<PageViewModel<PostViewModel>> {
    try {
      const posts: Post[] = await query
        .skip(page.calculateSkip())
        .limit(page.pageSize)
        .exec();
      const viewModels = posts.map((p) => PostMapper.toView(p));
      return page.add(...viewModels);
    } catch (error) {
      return page;
    }
  }
  private async mergeWithLikes(post: Post): Promise<PostViewModel> {
    throw new NotImplementedException();
  }
}
