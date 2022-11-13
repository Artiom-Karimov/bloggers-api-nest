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
import { BasicAuthGuard } from '../auth/guards/basic.auth.guard';
import PageViewModel from '../../common/models/page.view.model';
import CommentsQueryRepository from './comments/comments.query.repository';
import CommentViewModel from './models/comments/comment.view.model';
import GetCommentsQuery from './models/comments/get.comments.query';
import GetPostsQuery from './models/posts/get.posts.query';
import PostInputModel from './models/posts/post.input.model';
import PostViewModel from './models/posts/post.view.model';
import PostsQueryRepository from './posts.query.repository';
import PostsService from './posts.service';
import { OptionalBearerAuthGuard } from '../auth/guards/optional.bearer.auth.guard';
import { throwValidationException } from '../../common/utils/validation.options';
import { BearerAuthGuard } from '../auth/guards/bearer.auth.guard';
import CommentInputModel from './models/comments/comment.input.model';
import CommentsService from './comments/comments.service';

@Controller('posts')
export default class PostsController {
  constructor(
    private readonly service: PostsService,
    private readonly queryRepo: PostsQueryRepository,
    private readonly commentsQueryRepo: CommentsQueryRepository,
    private readonly commentsService: CommentsService,
  ) { }

  @Get()
  @UseGuards(OptionalBearerAuthGuard)
  async get(
    @Query() reqQuery: any,
    @Body() body: any,
  ): Promise<PageViewModel<PostViewModel>> {
    const query = new GetPostsQuery(reqQuery, undefined, body.userId);
    return this.queryRepo.getPosts(query);
  }
  @Get(':id')
  @UseGuards(OptionalBearerAuthGuard)
  async getOne(
    @Param('id') id: string,
    @Body() body: any,
  ): Promise<PostViewModel> {
    const result = await this.queryRepo.getPost(id, body.userId);
    if (!result) throw new NotFoundException();
    return result;
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  @HttpCode(201)
  async create(@Body() data: PostInputModel): Promise<PostViewModel> {
    const blog = await this.queryRepo.getBlog(data.blogId);
    if (!blog) throwValidationException('blogId', 'blog does not exist');

    data.blogName = blog.name;
    const created = await this.service.create(data);
    if (!created) throw new BadRequestException();

    const retrieved = await this.queryRepo.getPost(created, undefined);
    if (!retrieved) throw new BadRequestException();

    return retrieved;
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async update(
    @Param('id') id: string,
    @Body() data: PostInputModel,
  ): Promise<void> {
    const blog = await this.queryRepo.getBlog(data.blogId);
    if (!blog) throwValidationException('blogId', 'blog does not exist');

    data.blogName = blog.name;
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

  @Get(':id/comments')
  @UseGuards(OptionalBearerAuthGuard)
  async getComments(
    @Param('id') id: string,
    @Query() reqQuery: any,
    @Body() body: any,
  ): Promise<PageViewModel<CommentViewModel>> {
    const query = new GetCommentsQuery(reqQuery, id, body.userId);
    return this.commentsQueryRepo.getComments(query);
  }

  @Post(':id/comments')
  @UseGuards(BearerAuthGuard)
  async createComment(
    @Param('id') postId: string,
    @Body() data: CommentInputModel,
  ): Promise<CommentViewModel> {
    data.postId = postId;

    const created = await this.commentsService.create(data);
    if (!created) throw new BadRequestException();

    return created;
  }
}
