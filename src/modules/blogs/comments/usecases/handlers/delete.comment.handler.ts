import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CommentsRepository from '../../interfaces/comments.repository';
import DeleteCommentCommand from '../commands/delete.comment.command';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(private readonly repo: CommentsRepository) { }

  async execute(command: DeleteCommentCommand): Promise<void> {
    const { commentId, userId } = command;
    const comment = await this.repo.get(commentId);
    if (!comment) throw new NotFoundException('comment not found');
    if (comment.userId !== userId)
      throw new ForbiddenException('operation not alowed');

    const deleted = await this.repo.delete(commentId);
    if (!deleted) throw new BadRequestException('cannot create comment');
  }
}
