import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogError } from '../../../blogs/models/blog.error';
import CommentsRepository from '../../comments.repository';
import UpdateCommentCommand from '../commands/update.comment.command';

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private readonly repo: CommentsRepository) { }

  async execute(command: UpdateCommentCommand): Promise<BlogError> {
    const { commentId, userId, content } = command.data;
    const comment = await this.repo.get(commentId);
    if (!comment) return BlogError.NotFound;

    const modelUpdated = comment.setContent(content, userId);
    if (modelUpdated !== BlogError.NoError) return modelUpdated;

    const dbUpdated = this.repo.update(comment);
    return dbUpdated ? BlogError.NoError : BlogError.Unknown;
  }
}
