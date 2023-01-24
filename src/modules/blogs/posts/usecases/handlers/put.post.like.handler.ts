import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import PostsRepository from '../../interfaces/posts.repository';
import PutPostLikeCommand from '../commands/put.post.like.command';
import UsersRepository from '../../../../users/interfaces/users.repository';
import { LikesRepository } from '../../../likes/interfaces/likes.repository';
import { PostLike } from '../../../likes/typeorm/models/post.like';
import { Inject } from '@nestjs/common';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';

@CommandHandler(PutPostLikeCommand)
export class PutPostLikeHandler implements ICommandHandler<PutPostLikeCommand> {
  constructor(
    private readonly postsRepo: PostsRepository,
    @Inject('PostLikesRepository')
    private readonly likeRepo: LikesRepository<PostLike>,
    private readonly usersRepo: UsersRepository,
  ) { }

  async execute(command: PutPostLikeCommand): Promise<void> {
    const { entityId, userId } = command.data;
    const post = await this.postsRepo.get(entityId);
    if (!post) throw new NotFoundException('post not found');

    const user = await this.usersRepo.get(userId);
    if (!user || user.isBanned)
      throw new ForbiddenException('operation not allowed');

    const like = PostLike.create(command.data, user, post);
    const result = await this.likeRepo.put(like);

    if (!result) throw new BadRequestException('cannot put like');
  }
}
