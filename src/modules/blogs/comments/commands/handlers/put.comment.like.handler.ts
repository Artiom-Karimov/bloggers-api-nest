import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogError } from '../../../blogs/models/blog.error';
import CommentsRepository from '../../interfaces/comments.repository';
import PutCommentLikeCommand from '../commands/put.comment.like.command';
import UsersRepository from '../../../../users/interfaces/users.repository';

@CommandHandler(PutCommentLikeCommand)
export class PutCommentLikeHandler
  implements ICommandHandler<PutCommentLikeCommand>
{
  constructor(
    private readonly commentsRepo: CommentsRepository,
    private readonly usersRepo: UsersRepository,
  ) { }

  async execute(command: PutCommentLikeCommand): Promise<BlogError> {
    const { entityId, userId } = command.data;
    const comment = await this.commentsRepo.get(entityId);
    if (!comment) return BlogError.NotFound;

    const user = await this.usersRepo.get(userId);
    if (!user || user.isBanned) return BlogError.Forbidden;

    comment.putLike(command.data, user);
    const result = await this.commentsRepo.update(comment);

    return result ? BlogError.NoError : BlogError.Unknown;
  }
}
