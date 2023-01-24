import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogError } from '../../../blogs/models/blog.error';
import CommentsRepository from '../../interfaces/comments.repository';
import DeleteCommentCommand from '../commands/delete.comment.command';

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(private readonly repo: CommentsRepository) { }

  async execute(command: DeleteCommentCommand): Promise<BlogError> {
    const { commentId, userId } = command;
    const comment = await this.repo.get(commentId);
    if (!comment) return BlogError.NotFound;
    if (comment.userId !== userId) return BlogError.Forbidden;

    const deleted = await this.repo.delete(commentId);
    return deleted ? BlogError.NoError : BlogError.Unknown;
  }
}
