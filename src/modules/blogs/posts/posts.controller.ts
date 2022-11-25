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
import PageViewModel from '../../../common/models/page.view.model';
import CommentsQueryRepository from '../comments/comments.query.repository';
import CommentViewModel from '../comments/models/comment.view.model';
import GetCommentsQuery from '../comments/models/get.comments.query';
import GetPostsQuery from '../posts/models/get.posts.query';
import PostViewModel from '../posts/models/post.view.model';
import PostsQueryRepository from './posts.query.repository';
import PostsService from './posts.service';
import { OptionalBearerAuthGuard } from '../../auth/guards/optional.bearer.auth.guard';
import { BearerAuthGuard } from '../../auth/guards/bearer.auth.guard';
import CommentInputModel from '../comments/models/comment.input.model';
import CommentsService from '../comments/comments.service';
import LikeInputModel from '../likes/models/like.input.model';
import { Request } from 'express';
import TokenPayload from '../../auth/models/jwt/token.payload';
import { User } from '../../auth/guards/user.decorator';

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
    @User() user: TokenPayload,
  ): Promise<PageViewModel<PostViewModel>> {
    const query = new GetPostsQuery(reqQuery, undefined, user?.userId);
    return this.queryRepo.getPosts(query);
  }
  @Get(':id')
  @UseGuards(OptionalBearerAuthGuard)
  async getOne(
    @Param('id') id: string,
    @User() user: TokenPayload,
  ): Promise<PostViewModel> {
    const result = await this.queryRepo.getPost(id, user?.userId);
    if (!result) throw new NotFoundException();
    return result;
  }

  @Get(':id/comments')
  @UseGuards(OptionalBearerAuthGuard)
  async getComments(
    @Param('id') id: string,
    @Query() reqQuery: any,
    @User() user: TokenPayload,
  ): Promise<PageViewModel<CommentViewModel>> {
    const post = await this.queryRepo.getPost(id, undefined);
    if (!post) throw new NotFoundException();

    const query = new GetCommentsQuery(reqQuery, id, user?.userId);
    return this.commentsQueryRepo.getComments(query);
  }

  @Post(':id/comments')
  @UseGuards(BearerAuthGuard)
  async createComment(
    @Param('id') postId: string,
    @Body() data: CommentInputModel,
    @User() user: TokenPayload,
  ): Promise<CommentViewModel> {
    const post = await this.queryRepo.getPost(postId, undefined);
    if (!post) throw new NotFoundException();

    data.postId = postId;
    data.userId = user.userId;
    data.userLogin = user.userLogin;

    const created = await this.commentsService.create(data);
    if (!created) throw new BadRequestException();

    const retrieved = await this.commentsQueryRepo.getComment(
      created,
      data.userId,
    );
    if (!retrieved) throw new BadRequestException();

    return retrieved;
  }

  @Put(':id/like-status')
  @UseGuards(BearerAuthGuard)
  @HttpCode(204)
  async putLike(
    @Param('id') postId: string,
    @Body() data: LikeInputModel,
    @User() user: TokenPayload,
  ) {
    data.entityId = postId;
    data.userId = user.userId;
    data.userLogin = user.userLogin;

    const result = await this.service.putLike(data);
    if (!result) throw new NotFoundException();
    return;
  }
}
