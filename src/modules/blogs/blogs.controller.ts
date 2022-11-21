import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BasicAuthGuard } from '../auth/guards/basic.auth.guard';
import PageViewModel from '../../common/models/page.view.model';
import GetPostsQuery from '../posts/models/posts/get.posts.query';
import PostInputModel from '../posts/models/posts/post.input.model';
import PostViewModel from '../posts/models/posts/post.view.model';
import PostsQueryRepository from '../posts/posts/posts.query.repository';
import PostsService from '../posts/posts/posts.service';
import BlogsQueryRepository from './blogs.query.repository';
import BlogsService from './blogs.service';
import BlogInputModel from './models/blog.input.model';
import BlogViewModel from './models/blog.view.model';
import GetBlogsQuery from './models/get.blogs.query';
import { OptionalBearerAuthGuard } from '../auth/guards/optional.bearer.auth.guard';
import { Request } from 'express';

@Controller('blogs')
export default class BlogsController {
  constructor(
    private readonly service: BlogsService,
    private readonly postsService: PostsService,
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

  @Post()
  @UseGuards(BasicAuthGuard)
  async create(@Body() data: BlogInputModel): Promise<BlogViewModel> {
    const created = await this.service.create(data);
    if (!created) throw new BadRequestException();
    const retrieved = await this.queryRepo.getBlog(created);
    if (!retrieved) throw new NotFoundException();
    return retrieved;
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async update(
    @Param('id') id: string,
    @Body() data: BlogInputModel,
  ): Promise<void> {
    const updated = await this.service.update(id, data);
    if (!updated) throw new NotFoundException();
    return;
  }

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    const deleted = await this.service.delete(id);
    if (!deleted) throw new NotFoundException();
    return;
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

  @Post(':id/posts')
  @UseGuards(BasicAuthGuard)
  async createPost(
    @Body() data: PostInputModel,
    @Param('id') id: string,
  ): Promise<PostViewModel> {
    const blog = await this.queryRepo.getBlog(id);
    if (!blog) throw new NotFoundException();

    data.blogId = blog.id;
    data.blogName = blog.name;

    const created = await this.postsService.create(data);
    if (!created) throw new BadRequestException();

    const retrieved = this.postsQueryRepo.getPost(created, undefined);
    if (!retrieved) throw new BadRequestException();

    return retrieved;
  }
}
