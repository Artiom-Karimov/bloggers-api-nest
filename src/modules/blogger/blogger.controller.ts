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
import PostInputModel from '../blogs/posts/models/post.input.model';
import PostViewModel from '../blogs/posts/models/post.view.model';
import BlogsQueryRepository from '../blogs/blogs/interfaces/blogs.query.repository';
import BlogViewModel from '../blogs/blogs/models/view/blog.view.model';
import GetBlogsQuery from '../blogs/blogs/models/input/get.blogs.query';
import { CommandBus } from '@nestjs/cqrs';
import CreateBlogCommand from '../blogs/blogs/usecases/commands/create.blog.command';
import UpdateBlogCommand from '../blogs/blogs/usecases/commands/update.blog.command';
import DeleteBlogCommand from '../blogs/blogs/usecases/commands/delete.blog.command';
import { User } from '../auth/guards/user.decorator';
import TokenPayload from '../auth/models/jwt/token.payload';
import CreatePostCommand from '../blogs/posts/usecases/commands/create.post.command';
import UpdatePostCommand from '../blogs/posts/usecases/commands/update.post.command';
import DeletePostCommand from '../blogs/posts/usecases/commands/delete.post.command';
import BloggerCommentViewModel from '../blogs/comments/models/view/blogger.comment.view.model';
import BloggerCommentsQueryRepository from '../blogs/comments/interfaces/blogger.comments.query.repository';
import GetBloggerCommentsQuery from '../blogs/comments/models/input/get.blogger.comments.query';
import IdParams from '../../common/models/id.param';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist/decorators';
import { BlogPage, BloggerCommentPage } from '../swagger/models/pages';

@Controller('blogger/blogs')
@UseGuards(BearerAuthGuard)
@ApiTags('Blogs (for blogger)')
@ApiBearerAuth()
export default class BloggerController {
  constructor(
    private readonly blogsQueryRepo: BlogsQueryRepository,
    private readonly postsQueryRepo: PostsQueryRepository,
    private readonly commentsQueryRepo: BloggerCommentsQueryRepository,
    private readonly commandBus: CommandBus,
  ) { }

  @Get()
  @ApiOperation({ summary: "Get bloggers's own blog list" })
  @ApiQuery({ type: GetBlogsQuery })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: BlogPage,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async getBlogs(
    @User() user: TokenPayload,
    @Query() reqQuery: any,
  ): Promise<PageViewModel<BlogViewModel>> {
    const query = new GetBlogsQuery(reqQuery);
    return this.blogsQueryRepo.getBloggerBlogs(query, user.userId);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create new blog' })
  @ApiResponse({
    status: 201,
    description: 'Success, returns created blog',
    type: BlogViewModel,
  })
  @ApiResponse({ status: 400, description: 'Illegal values received' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async createBlog(
    @Body() data: BlogInputModel,
    @User() user: TokenPayload,
  ): Promise<BlogViewModel> {
    const created = await this.commandBus.execute(
      new CreateBlogCommand(data, user.userId),
    );
    const retrieved = await this.blogsQueryRepo.getBlog(created);
    if (!retrieved) throw new NotFoundException();
    return retrieved;
  }

  @Put(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Update blog info' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 204, description: 'Success, no data' })
  @ApiResponse({ status: 400, description: 'Illegal values received' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: "Tried to update someone else's blog",
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  public async updateBlog(
    @Body() data: BlogInputModel,
    @Param() params: IdParams,
    @User() user: TokenPayload,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdateBlogCommand(params.id, data, user.userId),
    );
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete blog' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 204, description: 'Success, no data' })
  @ApiResponse({ status: 400, description: 'Illegal values received' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: "Tried to delete someone else's blog",
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  public async deleteBlog(
    @Param() params: IdParams,
    @User() user: TokenPayload,
  ): Promise<void> {
    return this.commandBus.execute(
      new DeleteBlogCommand(params.id, user.userId),
    );
  }

  @Post(':blogId/posts')
  @HttpCode(201)
  @ApiOperation({ summary: 'Create new post' })
  @ApiParam({ name: 'blogId' })
  @ApiResponse({
    status: 201,
    description: 'Success, returns created post',
    type: PostViewModel,
  })
  @ApiResponse({ status: 400, description: 'Illegal values received' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Blog is not owned by this user' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
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

    const retrieved = await this.postsQueryRepo.getPost(created, undefined);
    if (!retrieved) throw new BadRequestException();

    return retrieved;
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Update post' })
  @ApiParam({ name: 'blogId' })
  @ApiParam({ name: 'postId' })
  @ApiResponse({ status: 204, description: 'Success, no data' })
  @ApiResponse({ status: 400, description: 'Illegal values received' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Blog is not owned by this user' })
  @ApiResponse({ status: 404, description: 'Blog or post not found' })
  public async updatePost(
    @Param() params: IdParams,
    @Body() data: PostInputModel,
    @User() user: TokenPayload,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdatePostCommand({
        postId: params.postId,
        blogId: params.blogId,
        bloggerId: user.userId,
        data,
      }),
    );
  }

  @Delete(':blogId/posts/:postId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete post' })
  @ApiParam({ name: 'blogId' })
  @ApiParam({ name: 'postId' })
  @ApiResponse({ status: 204, description: 'Success, no data' })
  @ApiResponse({ status: 400, description: 'Illegal values received' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Blog is not owned by this user' })
  @ApiResponse({ status: 404, description: 'Blog or post not found' })
  public async deletePost(
    @Param() params: IdParams,
    @User() user: TokenPayload,
  ): Promise<void> {
    return this.commandBus.execute(
      new DeletePostCommand({
        blogId: params.blogId,
        postId: params.postId,
        bloggerId: user.userId,
      }),
    );
  }

  @Get('comments')
  @ApiOperation({ summary: 'Get comments for all blogs owned by user' })
  @ApiQuery({ type: GetBloggerCommentsQuery })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: BloggerCommentPage,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public async getComments(
    @Query() reqQuery: any,
    @User() user: TokenPayload,
  ): Promise<PageViewModel<BloggerCommentViewModel>> {
    const query = new GetBloggerCommentsQuery(reqQuery, user.userId);
    return this.commentsQueryRepo.getBloggerComments(query);
  }
}
