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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist/decorators';

@Controller('comments')
@ApiTags('Comments (for user)')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryRepo: CommentsQueryRepository,
  ) { }

  @Get(':id')
  @UseGuards(OptionalBearerAuthGuard)
  @UseGuards(OptionalBearerAuthGuard)
  @ApiOperation({ summary: 'Get comment by id' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: CommentViewModel,
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 400, description: 'Illegal values received' })
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
  @ApiOperation({ summary: 'Update comment' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 204, description: 'Success, no data' })
  @ApiResponse({ status: 400, description: 'Illegal values received' })
  @ApiResponse({
    status: 403,
    description: "Trying to edit someone else's comment",
  })
  @ApiResponse({ status: 404, description: 'Not found' })
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
  @ApiOperation({ summary: 'Delete comment' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 204, description: 'Success, no data' })
  @ApiResponse({ status: 400, description: 'Illegal values received' })
  @ApiResponse({
    status: 403,
    description: "Trying to delete someone else's comment",
  })
  @ApiResponse({ status: 404, description: 'Not found' })
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
  @ApiOperation({ summary: 'Put like for comment' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 204, description: 'Success, no data' })
  @ApiResponse({ status: 400, description: 'Illegal values received' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'User is banned' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
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
