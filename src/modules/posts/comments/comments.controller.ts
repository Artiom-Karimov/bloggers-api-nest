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
import CommentViewModel from '../models/comments/comment.view.model';
import {
  Body,
  Delete,
  HttpCode,
  Put,
  UseGuards,
} from '@nestjs/common/decorators';
import { BearerAuthGuard } from '../../auth/guards/bearer.auth.guard';
import CommentInputModel from '../models/comments/comment.input.model';
import CommentsService, { CommentError } from './comments.service';
import TokenPayload from '../../auth/models/jwt/token.payload';
import { OptionalBearerAuthGuard } from '../../auth/guards/optional.bearer.auth.guard';
import LikeInputModel from '../models/likes/like.input.model';
import { Request } from 'express';

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
    @Req() req: Request,
  ): Promise<CommentViewModel> {
    const result = await this.queryRepo.getComment(id, req.user?.userId);
    if (!result) throw new NotFoundException();
    return result;
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() data: CommentInputModel,
    @Req() req: Request,
  ): Promise<void> {
    data.userId = req.user.userId;
    data.userLogin = req.user.userLogin;
    const result = await this.service.update(id, data);
    if (result === CommentError.NoError) return;
    if (result === CommentError.NotFound) throw new NotFoundException();
    if (result === CommentError.Forbidden) throw new ForbiddenException();
    throw new BadRequestException();
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(BearerAuthGuard)
  async delete(@Param('id') id: string, @Req() req: Request): Promise<void> {
    const result = await this.service.delete(id, req.user.userId);
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
    @Req() req: Request,
  ) {
    data.entityId = commentId;
    data.userId = req.user.userId;
    data.userLogin = req.user.userLogin;

    const result = await this.service.putLike(data);
    if (!result) throw new NotFoundException();
    return;
  }
}
