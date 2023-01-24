import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CommentsRepository from '../../interfaces/comments.repository';
import PutCommentLikeCommand from '../commands/put.comment.like.command';
import UsersRepository from '../../../../users/interfaces/users.repository';
import { CommentLike } from '../../../likes/typeorm/models/comment.like';
import { LikesRepository } from '../../../likes/interfaces/likes.repository';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  NotFoundException,
} from '@nestjs/common';

@CommandHandler(PutCommentLikeCommand)
export class PutCommentLikeHandler
  implements ICommandHandler<PutCommentLikeCommand>
{
  constructor(
    private readonly commentsRepo: CommentsRepository,
    @Inject('CommentLikesRepository')
    private readonly likeRepo: LikesRepository<CommentLike>,
    private readonly usersRepo: UsersRepository,
  ) { }

  async execute(command: PutCommentLikeCommand): Promise<void> {
    const { entityId, userId } = command.data;
    const comment = await this.commentsRepo.get(entityId);
    if (!comment) throw new NotFoundException('comment not found');

    const user = await this.usersRepo.get(userId);
    if (!user || user.isBanned)
      throw new ForbiddenException('operation not alowed');

    const like = CommentLike.create(command.data, user, comment);
    const result = await this.likeRepo.put(like);

    if (!result) throw new BadRequestException('cannot create like');
  }
}
