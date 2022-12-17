import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogError } from '../../../blogs/models/blog.error';
import CommentLikesRepository from '../../../likes/interfaces/comment.likes.repository';
import LikeModel from '../../../likes/models/like.model';
import CommentsRepository from '../../comments.repository';
import PutCommentLikeCommand from '../commands/put.comment.like.command';

@CommandHandler(PutCommentLikeCommand)
export class PutCommentLikeHandler
  implements ICommandHandler<PutCommentLikeCommand>
{
  constructor(
    private readonly commentsRepo: CommentsRepository,
    private readonly likesRepo: CommentLikesRepository,
  ) { }

  async execute(command: PutCommentLikeCommand): Promise<BlogError> {
    const { entityId, userId, likeStatus } = command.data;
    const comment = await this.commentsRepo.get(entityId);
    if (!comment) return BlogError.NotFound;

    let like = await this.likesRepo.get(entityId, userId);
    if (like) {
      like.updateData(likeStatus, userId);
      const result = await this.likesRepo.update(like);
      return result ? BlogError.NoError : BlogError.Unknown;
    }
    like = LikeModel.create(command.data);
    const result = await this.likesRepo.create(like);
    return result ? BlogError.NoError : BlogError.Unknown;
  }
}
