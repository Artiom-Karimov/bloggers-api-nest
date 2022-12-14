import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import PageViewModel from '../../../common/models/page.view.model';
import CommentsQueryRepository from '../comments/comments.query.repository';
import CommentViewModel from '../comments/models/view/comment.view.model';
import GetCommentsQuery from '../comments/models/input/get.comments.query';
import GetPostsQuery from '../posts/models/get.posts.query';
import PostViewModel from '../posts/models/post.view.model';
import PostsQueryRepository from './interfaces/posts.query.repository';
import { OptionalBearerAuthGuard } from '../../auth/guards/optional.bearer.auth.guard';
import { BearerAuthGuard } from '../../auth/guards/bearer.auth.guard';
import CommentInputModel from '../comments/models/input/comment.input.model';
import LikeInputModel from '../likes/models/like.input.model';
import TokenPayload from '../../auth/models/jwt/token.payload';
import { User } from '../../auth/guards/user.decorator';
import { CommandBus } from '@nestjs/cqrs';
import PutPostLikeCommand from './commands/commands/put.post.like.command';
import CreateCommentCommand from '../comments/commands/commands/create.comment.command';
import { BlogError } from '../blogs/models/blog.error';

@Controller('posts')
export default class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryRepo: PostsQueryRepository,
    private readonly commentsQueryRepo: CommentsQueryRepository,
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
    const result = await this.commandBus.execute(
      new CreateCommentCommand({
        postId,
        userId: user.userId,
        userLogin: user.userLogin,
        content: data.content,
      }),
    );

    if (typeof result === 'string') {
      const comment = await this.commentsQueryRepo.getComment(
        result,
        undefined,
      );
      if (comment) return comment;
      throw new BadRequestException();
    }
    if (result === BlogError.NotFound) throw new NotFoundException();
    if (result === BlogError.Forbidden) throw new ForbiddenException();
    throw new BadRequestException();
  }

  @Put(':id/like-status')
  @UseGuards(BearerAuthGuard)
  @HttpCode(204)
  async putLike(
    @Param('id') postId: string,
    @Body() data: LikeInputModel,
    @User() user: TokenPayload,
  ) {
    const result = await this.commandBus.execute(
      new PutPostLikeCommand({
        entityId: postId,
        userId: user.userId,
        userLogin: user.userLogin,
        likeStatus: data.likeStatus,
      }),
    );
    if (result === BlogError.NoError) return;
    if (result === BlogError.NotFound) throw new NotFoundException();
    throw new BadRequestException();
  }
}
