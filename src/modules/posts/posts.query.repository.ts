import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import PageViewModel from 'src/common/models/page.view.model';
import GetPostsQuery from './models/get.posts.query';
import PostMapper from './models/post.mapper';
import Post, { PostDocument } from './models/post.schema';
import PostViewModel from './models/post.view.model';

@Injectable()
export default class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private readonly model: Model<PostDocument>,
  ) { }

  public async getPosts(
    params: GetPostsQuery,
  ): Promise<PageViewModel<PostViewModel>> {
    const page = await this.getPage(params);
    const query = this.getQuery(params);
    return this.loadPagePosts(page, query);
  }
  public async getPost(id: string): Promise<PostViewModel | undefined> {
    try {
      const result = await this.model.findOne({ _id: id });
      return result ? PostMapper.toView(result) : undefined;
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
}
