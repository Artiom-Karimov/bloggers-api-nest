import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CommentsRepository from '../../interfaces/comments.repository';
import UpdateCommentCommand from '../commands/update.comment.command';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private readonly repo: CommentsRepository) { }

  async execute(command: UpdateCommentCommand): Promise<void> {
    const { commentId, userId, content } = command.data;
    const comment = await this.repo.get(commentId);
    if (!comment) throw new NotFoundException('comment not found');

    try {
      comment.setContent(content, userId);
    } catch (error) {
      throw new ForbiddenException('operation not allowed');
    }

    const updated = this.repo.update(comment);
    if (!updated) throw new BadRequestException('cannot update comment');
  }
}
