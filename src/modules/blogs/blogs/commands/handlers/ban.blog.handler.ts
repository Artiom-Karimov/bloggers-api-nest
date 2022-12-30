import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import PostsRepository from '../../../posts/interfaces/posts.repository';
import BlogsRepository from '../../interfaces/blogs.repository';
import { BlogError } from '../../models/blog.error';
import BanBlogCommand from '../commands/ban.blog.command';

@CommandHandler(BanBlogCommand)
export class BanBlogHandler implements ICommandHandler<BanBlogCommand> {
  constructor(private readonly repo: BlogsRepository) { }

  async execute(command: BanBlogCommand): Promise<BlogError> {
    const blog = await this.repo.get(command.blogId);
    if (!blog) return BlogError.NotFound;

    if (blog.isBanned === command.data.isBanned) return BlogError.NoError;
    blog.isBanned = command.data.isBanned;
    const result = await this.repo.update(blog);

    return result ? BlogError.NoError : BlogError.Unknown;
  }
}
