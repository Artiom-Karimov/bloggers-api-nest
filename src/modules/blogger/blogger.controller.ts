import {
  BadRequestException,
  Body,
  Controller,
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
import { BearerAuthGuard } from '../auth/guards/bearer.auth.guard';
import BlogsQueryRepository from '../blogs/blogs.query.repository';
import BlogsService, { BlogError } from '../blogs/blogs.service';
import PostsQueryRepository from '../posts/posts/posts.query.repository';
import PostsService from '../posts/posts/posts.service';
import { Request } from 'express';
import GetBlogsQuery from '../blogs/models/get.blogs.query';
import PageViewModel from '../../common/models/page.view.model';
import BlogViewModel from '../blogs/models/blog.view.model';
import BlogInputModel from '../blogs/models/blog.input.model';
import { ForbiddenException } from '@nestjs/common/exceptions';

@Controller('blogger/blogs')
export default class BloggerController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly blogsQueryRepo: BlogsQueryRepository,
    private readonly postsQueryRepo: PostsQueryRepository,
  ) { }

  @Get()
  @UseGuards(BearerAuthGuard)
  public async getBlogs(
    @Req() req: Request,
    @Query() reqQuery: any,
  ): Promise<PageViewModel<BlogViewModel>> {
    const query = new GetBlogsQuery(reqQuery);
    return this.blogsQueryRepo.getBloggerBlogs(query, req.user.userId);
  }

  @Post()
  @UseGuards(BearerAuthGuard)
  @HttpCode(201)
  public async createBlog(
    @Body() data: BlogInputModel,
    @Req() req: Request,
  ): Promise<BlogViewModel> {
    const created = await this.blogsService.createForBlogger(data, {
      userId: req.user.userId,
      userLogin: req.user.userLogin,
    });
    if (!created) throw new BadRequestException();
    const retrieved = await this.blogsQueryRepo.getBlog(created);
    if (!retrieved) throw new NotFoundException();
    return retrieved;
  }

  @Put(':id')
  @UseGuards(BearerAuthGuard)
  @HttpCode(204)
  public async updateBlog(
    @Body() data: BlogInputModel,
    @Param('id') blogId: string,
    @Req() req: Request,
  ): Promise<void> {
    const result = await this.blogsService.updateForBlogger(
      blogId,
      data,
      req.user.userId,
    );
    if (result === BlogError.NoError) return;
    if (result === BlogError.NotFound) throw new NotFoundException();
    if (result === BlogError.Forbidden) throw new ForbiddenException();
    throw new BadRequestException();
  }
}
