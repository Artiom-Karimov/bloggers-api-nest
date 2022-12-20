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
import UpdateCommentCommand from './commands/commands/update.comment.command';
import { BlogError } from '../blogs/models/blog.error';
import DeleteCommentCommand from './commands/commands/delete.comment.command';
import IdParams from '../../../common/models/id.param';

@Controller('comments')
export default class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryRepo: CommentsQueryRepository,
  ) { }

  @Get(':id')
  @UseGuards(OptionalBearerAuthGuard)
  async getOne(
    @Param() params: IdParams,
    @User() user: TokenPayload,
  ): Promise<CommentViewModel> {
    const result = await this.queryRepo.getComment(params.id, user?.userId);
    if (!result) throw new NotFoundException();
    return result;
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  async update(
    @Param() params: IdParams,
    @Body() data: CommentInputModel,
    @User() user: TokenPayload,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new UpdateCommentCommand({
        commentId: params.id,
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
    @Param() params: IdParams,
    @User() user: TokenPayload,
  ): Promise<void> {
    const result = await this.commandBus.execute(
      new DeleteCommentCommand(params.id, user.userId),
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
    @Param() params: IdParams,
    @Body() data: LikeInputModel,
    @User() user: TokenPayload,
  ) {
    const result = await this.commandBus.execute(
      new PutCommentLikeCommand({
        entityId: params.id,
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
