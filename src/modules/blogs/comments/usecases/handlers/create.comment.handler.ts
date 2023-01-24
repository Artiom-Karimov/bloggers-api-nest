import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogUserBanRepository from '../../../blogs/interfaces/blog.user.ban.repository';
import { BlogError } from '../../../blogs/models/blog.error';
import PostsRepository from '../../../posts/interfaces/posts.repository';
import CommentsRepository from '../../interfaces/comments.repository';
import CreateCommentCommand from '../commands/create.comment.command';
import { Comment } from '../../typeorm/models/comment';
import UsersRepository from '../../../../users/interfaces/users.repository';

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

  async execute(command: CreateCommentCommand): Promise<string | BlogError> {
    const { postId, userId } = command.data;
    const post = await this.postsRepo.get(postId);
    if (!post) return BlogError.NotFound;

    const user = await this.usersRepo.get(userId);
    if (!user || user.isBanned) return BlogError.Forbidden;

    const ban = await this.banRepo.get(post.blogId, userId);
    if (ban) return BlogError.Forbidden;

    const comment = Comment.create(command.data, post, user);
    const created = await this.commentsRepo.create(comment);
    return created ?? BlogError.Unknown;
  }
}
