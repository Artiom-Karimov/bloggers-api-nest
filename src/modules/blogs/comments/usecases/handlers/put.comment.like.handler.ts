import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogError } from '../../../blogs/models/blog.error';
import CommentsRepository from '../../interfaces/comments.repository';
import PutCommentLikeCommand from '../commands/put.comment.like.command';
import UsersRepository from '../../../../users/interfaces/users.repository';
import { CommentLike } from '../../../likes/typeorm/models/comment.like';
import { LikesRepository } from '../../../likes/interfaces/likes.repository';
import { Inject } from '@nestjs/common';

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

  async execute(command: PutCommentLikeCommand): Promise<BlogError> {
    const { entityId, userId } = command.data;
    const comment = await this.commentsRepo.get(entityId);
    if (!comment) return BlogError.NotFound;

    const user = await this.usersRepo.get(userId);
    if (!user || user.isBanned) return BlogError.Forbidden;

    const like = CommentLike.create(command.data, user, comment);
    const result = await this.likeRepo.put(like);

    return result ? BlogError.NoError : BlogError.Unknown;
  }
}
