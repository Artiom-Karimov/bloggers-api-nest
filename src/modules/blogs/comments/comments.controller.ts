import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import CommentsQueryRepository from './comments.query.repository';
import CommentViewModel from './models/view/comment.view.model';
import {
  Body,
  Delete,
  HttpCode,
  Put,
  UseGuards,
} from '@nestjs/common/decorators';
import { BearerAuthGuard } from '../../auth/guards/bearer.auth.guard';
import CommentInputModel from './models/input/comment.input.model';
import { OptionalBearerAuthGuard } from '../../auth/guards/optional.bearer.auth.guard';
import LikeInputModel from '../likes/models/like.input.model';
import { User } from '../../auth/guards/user.decorator';
import TokenPayload from '../../auth/models/jwt/token.payload';
import PutCommentLikeCommand from './commands/commands/put.comment.like.command';
import { CommandBus } from '@nestjs/cqrs';
import { PostError } from '../posts/models/post.error';
import UpdateCommentCommand from './commands/commands/update.comment.command';
import { BlogError } from '../blogs/models/blog.error';
import DeleteCommentCommand from './commands/commands/delete.comment.command';

@Controller('comments')
export default class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryRepo: CommentsQueryRepository,
  ) { }

  @Get(':id')
  @UseGuards(OptionalBearerAuthGuard)
  async getOne(
    @Param('id') id: string,
    @User() user: TokenPayload,
  ): Promise<CommentViewModel> {
    const result = await this.queryRepo.getComment(id, user?.userId);
    if (!result) throw new NotFoundException();
    return result;
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() data: CommentInputModel,
    @User() user: TokenPayload,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new UpdateCommentCommand({
        commentId: id,
        userId: user.userId,
        content: data.content,
      }),
    );

    if (result === BlogError.NoError) return;
    if (result === BlogError.NotFound) throw new NotFoundException();
    if (result === BlogError.Forbidden) throw new ForbiddenException();
    throw new BadRequestException();
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  async delete(
    @Param('id') commentId: string,
    @User() user: TokenPayload,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new DeleteCommentCommand(commentId, user.userId),
    );

    if (result === BlogError.NoError) return;
    if (result === BlogError.NotFound) throw new NotFoundException();
    if (result === BlogError.Forbidden) throw new ForbiddenException();
    throw new BadRequestException();
  }

  @Put(':id/like-status')
  @UseGuards(BearerAuthGuard)
  @HttpCode(204)
  async putLike(
    @Param('id') commentId: string,
    @Body() data: LikeInputModel,
    @User() user: TokenPayload,
  ) {
    const result = await this.commandBus.execute(
      new PutCommentLikeCommand({
        entityId: commentId,
        userId: user.userId,
        userLogin: user.userLogin,
        likeStatus: data.likeStatus,
      }),
    );
    if (result === PostError.NoError) return;
    if (result === PostError.NotFound) throw new NotFoundException();
    throw new BadRequestException();
  }
}
