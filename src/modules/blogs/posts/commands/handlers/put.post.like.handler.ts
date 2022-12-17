import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogError } from '../../../blogs/models/blog.error';
import LikeModel from '../../../likes/models/like.model';
import PostLikesRepository from '../../../likes/interfaces/post.likes.repository';
import PostsRepository from '../../interfaces/posts.repository';
import PutPostLikeCommand from '../commands/put.post.like.command';

@CommandHandler(PutPostLikeCommand)
export class PutPostLikeHandler implements ICommandHandler<PutPostLikeCommand> {
  constructor(
    private readonly postsRepo: PostsRepository,
    private readonly likesRepo: PostLikesRepository,
  ) { }

  async execute(command: PutPostLikeCommand): Promise<BlogError> {
    const { entityId, userId, likeStatus } = command.data;
    const post = await this.postsRepo.get(entityId);
    if (!post) return BlogError.NotFound;

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
