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
import { BearerAuthGuard } from '../auth/guards/bearer.auth.guard';
import PostsQueryRepository from '../blogs/posts/posts.query.repository';
import PostsService from '../blogs/posts/posts.service';
import { Request } from 'express';
import PageViewModel from '../../common/models/page.view.model';
import BlogInputModel from '../blogs/blogs/models/blog.input.model';
import { ForbiddenException } from '@nestjs/common/exceptions';
import PostInputModel from '../blogs/posts/models/post.input.model';
import PostViewModel from '../blogs/posts/models/post.view.model';
import PostUpdateModel from '../blogs/posts/models/post.update.model';
import BlogsService, { BlogError } from '../blogs/blogs/blogs.service';
import BlogsQueryRepository from '../blogs/blogs/blogs.query.repository';
import BlogViewModel from '../blogs/blogs/models/blog.view.model';
import GetBlogsQuery from '../blogs/blogs/models/get.blogs.query';

@Controller('blogger/blogs')
@UseGuards(BearerAuthGuard)
export default class BloggerController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly blogsQueryRepo: BlogsQueryRepository,
    private readonly postsQueryRepo: PostsQueryRepository,
  ) { }

  @Get()
  public async getBlogs(
    @Req() req: Request,
    @Query() reqQuery: any,
  ): Promise<PageViewModel<BlogViewModel>> {
    const query = new GetBlogsQuery(reqQuery);
    return this.blogsQueryRepo.getBloggerBlogs(query, req.user.userId);
  }

  @Post()
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

  @Delete(':id')
  @HttpCode(204)
  public async deleteBlog(
    @Param('id') blogId: string,
    @Req() req: Request,
  ): Promise<void> {
    const result = await this.blogsService.deleteForBlogger(
      blogId,
      req.user.userId,
    );
    if (result === BlogError.NoError) return;
    if (result === BlogError.NotFound) throw new NotFoundException();
    if (result === BlogError.Forbidden) throw new ForbiddenException();
    throw new BadRequestException();
  }

  @Post(':blogId/posts')
  @HttpCode(201)
  public async createPost(
    @Param('blogId') blogId: string,
    @Body() data: PostInputModel,
    @Req() req: Request,
  ): Promise<PostViewModel> {
    const blog = await this.blogsQueryRepo.getAdminBlog(blogId);
    if (!blog) throw new NotFoundException();
    if (!blog.blogOwnerInfo || blog.blogOwnerInfo.userId !== req.user.userId)
      throw new ForbiddenException();

    data.blogId = blog.id;
    data.blogName = blog.name;

    const created = await this.postsService.create(data);
    if (!created) throw new BadRequestException();

    const retrieved = await this.postsQueryRepo.getPost(created, undefined);
    if (!retrieved) throw new BadRequestException();

    return retrieved;
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(204)
  public async updatePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() data: PostUpdateModel,
    @Req() req: Request,
  ): Promise<void> {
    const blog = await this.blogsQueryRepo.getAdminBlog(blogId);
    if (!blog) throw new NotFoundException();
    if (!blog.blogOwnerInfo || blog.blogOwnerInfo.userId !== req.user.userId)
      throw new ForbiddenException();

    const post = await this.postsQueryRepo.getPost(postId, undefined);
    if (!post) throw new NotFoundException();
    if (post.blogId !== blog.id) throw new NotFoundException();

    const result = await this.postsService.update(postId, data);
    if (!result) throw new NotFoundException();

    return;
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(204)
  public async deletePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Req() req: Request,
  ): Promise<void> {
    const blog = await this.blogsQueryRepo.getAdminBlog(blogId);
    if (!blog) throw new NotFoundException();
    if (!blog.blogOwnerInfo || blog.blogOwnerInfo.userId !== req.user.userId)
      throw new ForbiddenException();

    const post = await this.postsQueryRepo.getPost(postId, undefined);
    if (!post) throw new NotFoundException();
    if (post.blogId !== blog.id) throw new NotFoundException();

    const result = await this.postsService.delete(postId);
    if (!result) throw new NotFoundException();

    return;
  }
}
