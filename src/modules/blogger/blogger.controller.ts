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
  UseGuards,
} from '@nestjs/common';
import { BearerAuthGuard } from '../auth/guards/bearer.auth.guard';
import PostsQueryRepository from '../blogs/posts/posts.query.repository';
import PageViewModel from '../../common/models/page.view.model';
import BlogInputModel from '../blogs/blogs/models/blog.input.model';
import { ForbiddenException } from '@nestjs/common/exceptions';
import PostInputModel from '../blogs/posts/models/post.input.model';
import PostViewModel from '../blogs/posts/models/post.view.model';
import BlogsQueryRepository from '../blogs/blogs/blogs.query.repository';
import BlogViewModel from '../blogs/blogs/models/blog.view.model';
import GetBlogsQuery from '../blogs/blogs/models/get.blogs.query';
import { CommandBus } from '@nestjs/cqrs';
import CreateBlogCommand from '../blogs/blogs/commands/create.blog.command';
import UpdateBlogCommand from '../blogs/blogs/commands/update.blog.command';
import { BlogError } from '../blogs/blogs/models/blog.error';
import DeleteBlogCommand from '../blogs/blogs/commands/delete.blog.command';
import { BlogOwnerInfo } from '../blogs/blogs/models/blog.model';
import { User } from '../auth/guards/user.decorator';
import TokenPayload from '../auth/models/jwt/token.payload';
import CreatePostCommand from '../blogs/posts/commands/create.post.command';
import { PostError } from '../blogs/posts/models/post.error';
import UpdatePostCommand from '../blogs/posts/commands/update.post.command';
import DeletePostCommand from '../blogs/posts/commands/delete.post.command';

@Controller('blogger/blogs')
@UseGuards(BearerAuthGuard)
export default class BloggerController {
  constructor(
    private readonly blogsQueryRepo: BlogsQueryRepository,
    private readonly postsQueryRepo: PostsQueryRepository,
    private readonly commandBus: CommandBus,
  ) { }

  @Get()
  public async getBlogs(
    @User() user: TokenPayload,
    @Query() reqQuery: any,
  ): Promise<PageViewModel<BlogViewModel>> {
    const query = new GetBlogsQuery(reqQuery);
    return this.blogsQueryRepo.getBloggerBlogs(query, user.userId);
  }

  @Post()
  @HttpCode(201)
  public async createBlog(
    @Body() data: BlogInputModel,
    @User() user: TokenPayload,
  ): Promise<BlogViewModel> {
    const owner: BlogOwnerInfo = {
      userId: user.userId,
      userLogin: user.userLogin,
    };
    const created = await this.commandBus.execute(
      new CreateBlogCommand(data, owner),
    );
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
    @User() user: TokenPayload,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new UpdateBlogCommand(blogId, data, user.userId),
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
    @User() user: TokenPayload,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new DeleteBlogCommand(blogId, user.userId),
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
    @User() user: TokenPayload,
  ): Promise<PostViewModel> {
    const created = await this.commandBus.execute(
      new CreatePostCommand({
        ...data,
        blogId,
        bloggerId: user.userId,
      }),
    );

    if (typeof created !== 'string') {
      if (created === PostError.NotFound) throw new NotFoundException();
      if (created === PostError.Forbidden) throw new ForbiddenException();
      throw new BadRequestException();
    }

    const retrieved = await this.postsQueryRepo.getPost(created, undefined);
    if (!retrieved) throw new BadRequestException();

    return retrieved;
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(204)
  public async updatePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() data: PostInputModel,
    @User() user: TokenPayload,
  ): Promise<void> {
    const updated = await this.commandBus.execute(
      new UpdatePostCommand({
        postId,
        blogId,
        bloggerId: user.userId,
        data,
      }),
    );
    if (updated === PostError.NoError) return;
    if (updated === PostError.NotFound) throw new NotFoundException();
    if (updated === PostError.Forbidden) throw new ForbiddenException();
    throw new BadRequestException();
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(204)
  public async deletePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @User() user: TokenPayload,
  ): Promise<void> {
    const deleted = await this.commandBus.execute(
      new DeletePostCommand({
        blogId,
        postId,
        bloggerId: user.userId,
      }),
    );
    if (deleted === PostError.NoError) return;
    if (deleted === PostError.NotFound) throw new NotFoundException();
    if (deleted === PostError.Forbidden) throw new ForbiddenException();
    throw new BadRequestException();
  }
}
