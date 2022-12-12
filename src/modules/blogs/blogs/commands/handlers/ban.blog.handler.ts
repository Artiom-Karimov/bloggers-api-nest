import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import PostsRepository from '../../../posts/posts.repository';
import BlogsRepository from '../../interfaces/blogs.repository';
import { BlogError } from '../../models/blog.error';
import BanBlogCommand from '../commands/ban.blog.command';

@CommandHandler(BanBlogCommand)
export class BanBlogHandler implements ICommandHandler<BanBlogCommand> {
  constructor(
    private readonly repo: BlogsRepository,
    private readonly postsRepo: PostsRepository,
  ) { }

  async execute(command: BanBlogCommand): Promise<BlogError> {
    const blog = await this.repo.get(command.blogId);
    if (!blog) return BlogError.NotFound;

    if (blog.isBanned === command.data.isBanned) return BlogError.NoError;
    blog.banInfo = command.data.isBanned;
    let result = await this.repo.update(blog);

    result &&= await this.postsRepo.setBlogBan(command.blogId, blog.isBanned);
    return result ? BlogError.NoError : BlogError.Unknown;
  }
}
