import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogError } from '../../../blogs/models/blog.error';
import PostsRepository from '../../interfaces/posts.repository';
import PutPostLikeCommand from '../commands/put.post.like.command';
import UsersRepository from '../../../../users/interfaces/users.repository';
import { PostLikeRepository } from '../../../likes/interfaces/post.like.repository';
import { PostLike } from '../../../likes/typeorm/models/post.like';

@CommandHandler(PutPostLikeCommand)
export class PutPostLikeHandler implements ICommandHandler<PutPostLikeCommand> {
  constructor(
    private readonly postsRepo: PostsRepository,
    private readonly likeRepo: PostLikeRepository,
    private readonly usersRepo: UsersRepository,
  ) { }

  async execute(command: PutPostLikeCommand): Promise<BlogError> {
    const { entityId, userId } = command.data;
    const post = await this.postsRepo.get(entityId);
    if (!post) return BlogError.NotFound;

    const user = await this.usersRepo.get(userId);
    if (!user || user.isBanned) return BlogError.Forbidden;

    const like = PostLike.create(command.data, user, post);
    const result = await this.likeRepo.put(like);

    return result ? BlogError.NoError : BlogError.Unknown;
  }
}
