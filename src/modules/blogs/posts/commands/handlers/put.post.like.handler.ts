import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogError } from '../../../blogs/models/blog.error';
import PostLikesRepository from '../../../likes/interfaces/post.likes.repository';
import PostsRepository from '../../interfaces/posts.repository';
import PutPostLikeCommand from '../commands/put.post.like.command';
import { Like } from '../../../likes/typeorm/models/like';
import UsersRepository from '../../../../users/interfaces/users.repository';

@CommandHandler(PutPostLikeCommand)
export class PutPostLikeHandler implements ICommandHandler<PutPostLikeCommand> {
  constructor(
    private readonly postsRepo: PostsRepository,
    private readonly usersRepo: UsersRepository,
    private readonly likesRepo: PostLikesRepository,
  ) { }

  async execute(command: PutPostLikeCommand): Promise<BlogError> {
    const { entityId, userId, likeStatus } = command.data;
    const post = await this.postsRepo.get(entityId);
    if (!post) return BlogError.NotFound;

    const user = await this.usersRepo.get(userId);
    if (!user || user.isBanned) return BlogError.Forbidden;

    let like = await this.likesRepo.get(entityId, userId);
    if (like) {
      like.updateData(likeStatus, userId);
      const result = await this.likesRepo.update(like);
      return result ? BlogError.NoError : BlogError.Unknown;
    }
    like = Like.create(command.data, user);
    const result = await this.likesRepo.create(like);
    return result ? BlogError.NoError : BlogError.Unknown;
  }
}
