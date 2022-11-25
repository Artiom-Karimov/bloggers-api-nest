import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Req,
} from '@nestjs/common';
import CommentsQueryRepository from './comments.query.repository';
import CommentViewModel from '../comments/models/comment.view.model';
import {
  Body,
  Delete,
  HttpCode,
  Put,
  UseGuards,
} from '@nestjs/common/decorators';
import { BearerAuthGuard } from '../../auth/guards/bearer.auth.guard';
import CommentInputModel from './models/comment.input.model';
import CommentsService, { CommentError } from './comments.service';
import { OptionalBearerAuthGuard } from '../../auth/guards/optional.bearer.auth.guard';
import LikeInputModel from '../likes/models/like.input.model';
import { Request } from 'express';
import { User } from '../../auth/guards/user.decorator';
import TokenPayload from '../../auth/models/jwt/token.payload';

@Controller('comments')
export default class CommentsController {
  constructor(
    private readonly service: CommentsService,
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
    data.userId = user.userId;
    data.userLogin = user.userLogin;
    const result = await this.service.update(id, data);
    if (result === CommentError.NoError) return;
    if (result === CommentError.NotFound) throw new NotFoundException();
    if (result === CommentError.Forbidden) throw new ForbiddenException();
    throw new BadRequestException();
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  async delete(
    @Param('id') id: string,
    @User() user: TokenPayload,
  ): Promise<void> {
    const result = await this.service.delete(id, user.userId);
    if (result === CommentError.NoError) return;
    if (result === CommentError.NotFound) throw new NotFoundException();
    if (result === CommentError.Forbidden) throw new ForbiddenException();
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
    data.entityId = commentId;
    data.userId = user.userId;
    data.userLogin = user.userLogin;

    const result = await this.service.putLike(data);
    if (!result) throw new NotFoundException();
    return;
  }
}
