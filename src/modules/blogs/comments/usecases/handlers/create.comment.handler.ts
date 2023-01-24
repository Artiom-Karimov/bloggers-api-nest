import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogUserBanRepository from '../../../blogs/interfaces/blog.user.ban.repository';
import PostsRepository from '../../../posts/interfaces/posts.repository';
import CommentsRepository from '../../interfaces/comments.repository';
import CreateCommentCommand from '../commands/create.comment.command';
import { Comment } from '../../typeorm/models/comment';
import UsersRepository from '../../../../users/interfaces/users.repository';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    private readonly banRepo: BlogUserBanRepository,
    private readonly postsRepo: PostsRepository,
    private readonly usersRepo: UsersRepository,
    private readonly commentsRepo: CommentsRepository,
  ) { }

  async execute(command: CreateCommentCommand): Promise<string> {
    const { postId, userId } = command.data;
    const post = await this.postsRepo.get(postId);
    if (!post) throw new NotFoundException('post not found');

    const user = await this.usersRepo.get(userId);
    if (!user || user.isBanned)
      throw new ForbiddenException('operation not alowed');

    const ban = await this.banRepo.get(post.blogId, userId);
    if (ban) throw new ForbiddenException('operation not alowed');

    const comment = Comment.create(command.data, post, user);
    const created = await this.commentsRepo.create(comment);

    if (!created) throw new BadRequestException('cannot create comment');
    return created;
  }
}
