import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CommentLikesRepository from '../../../likes/comment.likes.repository';
import LikeModel from '../../../likes/models/like.model';
import { PostError } from '../../../posts/models/post.error';
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

  async execute(command: PutCommentLikeCommand): Promise<PostError> {
    const { entityId, userId, likeStatus } = command.data;
    const comment = await this.commentsRepo.get(entityId);
    if (!comment) return PostError.NotFound;

    let like = await this.likesRepo.get(entityId, userId);
    if (like) {
      like = LikeModel.update(like, likeStatus);
      const result = await this.likesRepo.update(like);
      return result ? PostError.NoError : PostError.Unknown;
    }
    like = LikeModel.create(command.data);
    const result = await this.likesRepo.create(like);
    return result ? PostError.NoError : PostError.Unknown;
  }
}
