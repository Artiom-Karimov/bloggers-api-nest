import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import LikeModel from '../../likes/models/like.model';
import PostLikesRepository from '../../likes/post.likes.repository';
import { PostError } from '../models/post.error';
import PostsRepository from '../posts.repository';
import PutPostLikeCommand from './put.post.like.command';

@CommandHandler(PutPostLikeCommand)
export class PutPostLikeHandler implements ICommandHandler<PutPostLikeCommand> {
  constructor(
    private readonly postsRepo: PostsRepository,
    private readonly likesRepo: PostLikesRepository,
  ) { }

  async execute(command: PutPostLikeCommand): Promise<PostError> {
    const { entityId, userId, likeStatus } = command.data;
    const post = await this.postsRepo.get(entityId);
    if (!post) return PostError.NotFound;

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
