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
import PostsQueryRepository from '../blogs/posts/interfaces/posts.query.repository';
import PageViewModel from '../../common/models/page.view.model';
import BlogInputModel from '../blogs/blogs/models/input/blog.input.model';
import { ForbiddenException } from '@nestjs/common/exceptions';
import PostInputModel from '../blogs/posts/models/post.input.model';
import PostViewModel from '../blogs/posts/models/post.view.model';
import BlogsQueryRepository from '../blogs/blogs/interfaces/blogs.query.repository';
import BlogViewModel from '../blogs/blogs/models/view/blog.view.model';
import GetBlogsQuery from '../blogs/blogs/models/input/get.blogs.query';
import { CommandBus } from '@nestjs/cqrs';
import CreateBlogCommand from '../blogs/blogs/commands/commands/create.blog.command';
import UpdateBlogCommand from '../blogs/blogs/commands/commands/update.blog.command';
import { BlogError } from '../blogs/blogs/models/blog.error';
import DeleteBlogCommand from '../blogs/blogs/commands/commands/delete.blog.command';
import { User } from '../auth/guards/user.decorator';
import TokenPayload from '../auth/models/jwt/token.payload';
import CreatePostCommand from '../blogs/posts/commands/commands/create.post.command';
import UpdatePostCommand from '../blogs/posts/commands/commands/update.post.command';
import DeletePostCommand from '../blogs/posts/commands/commands/delete.post.command';
import BloggerCommentViewModel from '../blogs/comments/models/view/blogger.comment.view.model';
import BloggerCommentsQueryRepository from '../blogs/comments/interfaces/blogger.comments.query.repository';
import GetBloggerCommentsQuery from '../blogs/comments/models/input/get.blogger.comments.query';
import IdParams from '../../common/models/id.param';

@Controller('blogger/blogs')
@UseGuards(BearerAuthGuard)
export default class BloggerController {
  constructor(
    private readonly blogsQueryRepo: BlogsQueryRepository,
    private readonly postsQueryRepo: PostsQueryRepository,
    private readonly commentsQueryRepo: BloggerCommentsQueryRepository,
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
    const created = await this.commandBus.execute(
      new CreateBlogCommand(data, user.userId),
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
    @Param() params: IdParams,
    @User() user: TokenPayload,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new UpdateBlogCommand(params.id, data, user.userId),
    );
    if (result === BlogError.NoError) return;
    if (result === BlogError.NotFound) throw new NotFoundException();
    if (result === BlogError.Forbidden) throw new ForbiddenException();
    throw new BadRequestException();
  }

  @Delete(':id')
  @HttpCode(204)
  public async deleteBlog(
    @Param() params: IdParams,
    @User() user: TokenPayload,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new DeleteBlogCommand(params.id, user.userId),
    );
    if (result === BlogError.NoError) return;
    if (result === BlogError.NotFound) throw new NotFoundException();
    if (result === BlogError.Forbidden) throw new ForbiddenException();
    throw new BadRequestException();
  }

  @Post(':blogId/posts')
  @HttpCode(201)
  public async createPost(
    @Param() params: IdParams,
    @Body() data: PostInputModel,
    @User() user: TokenPayload,
  ): Promise<PostViewModel> {
    const created = await this.commandBus.execute(
      new CreatePostCommand({
        ...data,
        blogId: params.blogId,
        bloggerId: user.userId,
      }),
    );

    if (typeof created !== 'string') {
      if (created === BlogError.NotFound) throw new NotFoundException();
      if (created === BlogError.Forbidden) throw new ForbiddenException();
      throw new BadRequestException();
    }

    const retrieved = await this.postsQueryRepo.getPost(created, undefined);
    if (!retrieved) throw new BadRequestException();

    return retrieved;
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(204)
  public async updatePost(
    @Param() params: IdParams,
    @Body() data: PostInputModel,
    @User() user: TokenPayload,
  ): Promise<void> {
    const updated = await this.commandBus.execute(
      new UpdatePostCommand({
        postId: params.postId,
        blogId: params.blogId,
        bloggerId: user.userId,
        data,
      }),
    );
    if (updated === BlogError.NoError) return;
    if (updated === BlogError.NotFound) throw new NotFoundException();
    if (updated === BlogError.Forbidden) throw new ForbiddenException();
    throw new BadRequestException();
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(204)
  public async deletePost(
    @Param() params: IdParams,
    @User() user: TokenPayload,
  ): Promise<void> {
    const deleted = await this.commandBus.execute(
      new DeletePostCommand({
        blogId: params.blogId,
        postId: params.postId,
        bloggerId: user.userId,
      }),
    );
    if (deleted === BlogError.NoError) return;
    if (deleted === BlogError.NotFound) throw new NotFoundException();
    if (deleted === BlogError.Forbidden) throw new ForbiddenException();
    throw new BadRequestException();
  }

  @Get('comments')
  public async getComments(
    @Query() reqQuery: any,
    @User() user: TokenPayload,
  ): Promise<PageViewModel<BloggerCommentViewModel>> {
    const query = new GetBloggerCommentsQuery(reqQuery, user.userId);
    return this.commentsQueryRepo.getBloggerComments(query);
  }
}
