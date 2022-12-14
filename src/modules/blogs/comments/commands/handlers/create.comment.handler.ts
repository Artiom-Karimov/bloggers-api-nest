import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogUserBanRepository from '../../../blogs/interfaces/blog.user.ban.repository';
import { BlogError } from '../../../blogs/models/blog.error';
import PostsRepository from '../../../posts/interfaces/posts.repository';
import CommentsRepository from '../../comments.repository';
import CommentModel from '../../models/comment.model';
import CreateCommentCommand from '../commands/create.comment.command';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    private readonly banRepo: BlogUserBanRepository,
    private readonly postsRepo: PostsRepository,
    private readonly commentsRepo: CommentsRepository,
  ) { }

  async execute(command: CreateCommentCommand): Promise<string | BlogError> {
    const { postId, userId } = command.data;
    const post = await this.postsRepo.get(postId);
    if (!post) return BlogError.NotFound;

    const ban = await this.banRepo.get(post.blogId, userId);
    if (ban) return BlogError.Forbidden;

    const comment = CommentModel.create(command.data);
    const created = await this.commentsRepo.create(comment);
    return created ?? BlogError.Unknown;
  }
}
