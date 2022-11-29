import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import PageViewModel from '../../../common/models/page.view.model';
import PostLikesQueryRepository from '../likes/post.likes.query.repository';
import BlogMapper from '../blogs/models/blog.mapper';
import Blog, { BlogDocument } from '../blogs/models/blog.schema';
import BlogViewModel from '../blogs/models/view/blog.view.model';
import GetPostsQuery from '../posts/models/get.posts.query';
import PostMapper from '../posts/models/post.mapper';
import Post, { PostDocument } from '../posts/models/post.schema';
import PostViewModel from '../posts/models/post.view.model';

@Injectable()
export default class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name) private readonly model: Model<PostDocument>,
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    private readonly likesQueryRepo: PostLikesQueryRepository,
  ) { }

  public async getPosts(
    params: GetPostsQuery,
  ): Promise<PageViewModel<PostViewModel>> {
    const page = await this.getPage(params);
    const query = this.getQuery(params);
    return this.loadPagePosts(page, query, params.userId);
  }
  public async getPost(
    id: string,
    userId: string | undefined,
  ): Promise<PostViewModel | undefined> {
    try {
      const post = await this.model.findOne({ _id: id, blogBanned: false });
      return post ? this.mergeWithLikes(post, userId) : undefined;
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
    return blogId
      ? { blogId: blogId, blogBanned: false }
      : { blogBanned: false };
  }
  private async loadPagePosts(
    page: PageViewModel<PostViewModel>,
    query: any,
    userId: string | undefined,
  ): Promise<PageViewModel<PostViewModel>> {
    try {
      const posts: Post[] = await query
        .skip(page.calculateSkip())
        .limit(page.pageSize)
        .exec();
      const viewModels = await this.mergeManyWithLikes(posts, userId);
      return page.add(...viewModels);
    } catch (error) {
      return page;
    }
  }
  private async mergeManyWithLikes(
    posts: Post[],
    userId: string | undefined,
  ): Promise<PostViewModel[]> {
    const promises = posts.map((p) => this.mergeWithLikes(p, userId));
    return Promise.all(promises);
  }
  private async mergeWithLikes(
    post: Post,
    userId: string | undefined,
  ): Promise<PostViewModel> {
    const likeInfo = await this.likesQueryRepo.getExtendedLikesInfo(
      post._id,
      userId,
    );
    return PostMapper.toView(post, likeInfo);
  }
}
