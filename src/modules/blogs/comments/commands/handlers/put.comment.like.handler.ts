import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogError } from '../../../blogs/models/blog.error';
import CommentLikesRepository from '../../../likes/interfaces/comment.likes.repository';
import CommentsRepository from '../../interfaces/comments.repository';
import PutCommentLikeCommand from '../commands/put.comment.like.command';
import UsersRepository from '../../../../users/interfaces/users.repository';
import { CommentLike } from '../../../likes/typeorm/models/comment.like';

@CommandHandler(PutCommentLikeCommand)
export class PutCommentLikeHandler
  implements ICommandHandler<PutCommentLikeCommand>
{
  constructor(
    private readonly commentsRepo: CommentsRepository,
    private readonly usersRepo: UsersRepository,
    private readonly likesRepo: CommentLikesRepository,
  ) { }

  async execute(command: PutCommentLikeCommand): Promise<BlogError> {
    const { entityId, userId, likeStatus } = command.data;
    const comment = await this.commentsRepo.get(entityId);
    if (!comment) return BlogError.NotFound;

    const user = await this.usersRepo.get(userId);
    if (!user || user.isBanned) return BlogError.Forbidden;

    let like = await this.likesRepo.get(entityId, userId);
    if (like) {
      like.updateData(likeStatus, userId);
      const result = await this.likesRepo.update(like);
      return result ? BlogError.NoError : BlogError.Unknown;
    }
    like = CommentLike.create(command.data, user, comment);
    const result = await this.likesRepo.create(like);
    return result ? BlogError.NoError : BlogError.Unknown;
  }
}
