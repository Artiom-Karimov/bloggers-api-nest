import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import BlogsQueryRepository from './blogs.query.repository';
import { Request } from 'express';
import PostsQueryRepository from '../posts/posts.query.repository';
import PageViewModel from '../../../common/models/page.view.model';
import BlogViewModel from '../models/blogs/blog.view.model';
import GetBlogsQuery from '../models/blogs/get.blogs.query';
import { OptionalBearerAuthGuard } from '../../auth/guards/optional.bearer.auth.guard';
import PostViewModel from '../models/posts/post.view.model';
import GetPostsQuery from '../models/posts/get.posts.query';

@Controller('blogs')
export default class BlogsController {
  constructor(
    private readonly queryRepo: BlogsQueryRepository,
    private readonly postsQueryRepo: PostsQueryRepository,
  ) { }

  @Get()
  async get(@Query() reqQuery: any): Promise<PageViewModel<BlogViewModel>> {
    const query = new GetBlogsQuery(reqQuery);
    return this.queryRepo.getBlogs(query);
  }
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<BlogViewModel> {
    const blog = await this.queryRepo.getBlog(id);
    if (blog) return blog;
    throw new NotFoundException();
  }

  @Get(':id/posts')
  @UseGuards(OptionalBearerAuthGuard)
  async getPosts(
    @Query() reqQuery: any,
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<PageViewModel<PostViewModel>> {
    const blog = await this.queryRepo.getBlog(id);
    if (!blog) throw new NotFoundException();
    const userId = req.user ? req.user.userId : undefined;
    const query = new GetPostsQuery(reqQuery, id, userId);
    return this.postsQueryRepo.getPosts(query);
  }
}
