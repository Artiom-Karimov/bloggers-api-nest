import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogUserBanRepository from '../../blogs/blog.user.ban.repository';
import { PostError } from '../../posts/models/post.error';
import PostsRepository from '../../posts/posts.repository';
import CommentsRepository from '../comments.repository';
import CommentModel from '../models/comment.model';
import CreateCommentCommand from './create.comment.command';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    private readonly banRepo: BlogUserBanRepository,
    private readonly postsRepo: PostsRepository,
    private readonly commentsRepo: CommentsRepository,
  ) { }

  async execute(command: CreateCommentCommand): Promise<string | PostError> {
    const { postId, userId } = command.data;
    const post = await this.postsRepo.get(postId);
    if (!post) return PostError.NotFound;

    const ban = await this.banRepo.get(post.blogId, userId);
    if (ban) return PostError.Forbidden;

    const comment = CommentModel.create(command.data);
    const created = await this.commentsRepo.create(comment);
    return created ?? PostError.Unknown;
  }
}
