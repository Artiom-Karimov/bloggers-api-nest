import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import CommentsQueryRepository from './interfaces/comments.query.repository';
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
import PutCommentLikeCommand from './usecases/commands/put.comment.like.command';
import { CommandBus } from '@nestjs/cqrs';
import UpdateCommentCommand from './usecases/commands/update.comment.command';
import DeleteCommentCommand from './usecases/commands/delete.comment.command';
import IdParams from '../../../common/models/id.param';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger/dist/decorators';

@Controller('comments')
@ApiTags('Comments')
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
  @ApiBearerAuth()
  async update(
    @Param() params: IdParams,
    @Body() data: CommentInputModel,
    @User() user: TokenPayload,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdateCommentCommand({
        commentId: params.id,
        userId: user.userId,
        content: data.content,
      }),
    );
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  @ApiBearerAuth()
  async delete(
    @Param() params: IdParams,
    @User() user: TokenPayload,
  ): Promise<void> {
    return this.commandBus.execute(
      new DeleteCommentCommand(params.id, user.userId),
    );
  }

  @Put(':id/like-status')
  @UseGuards(BearerAuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  async putLike(
    @Param() params: IdParams,
    @Body() data: LikeInputModel,
    @User() user: TokenPayload,
  ) {
    return this.commandBus.execute(
      new PutCommentLikeCommand({
        entityId: params.id,
        userId: user.userId,
        likeStatus: data.likeStatus,
      }),
    );
  }
}
