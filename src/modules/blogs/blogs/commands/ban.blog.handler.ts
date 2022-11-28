import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import PostsRepository from '../../posts/posts.repository';
import BlogsRepository from '../blogs.repository';
import { BlogError } from '../models/blog.error';
import BlogModel from '../models/blog.model';
import BanBlogCommand from './ban.blog.command';

@CommandHandler(BanBlogCommand)
export class BanBlogHandler implements ICommandHandler<BanBlogCommand> {
  constructor(
    private readonly repo: BlogsRepository,
    private readonly postsRepo: PostsRepository,
  ) { }

  async execute(command: BanBlogCommand): Promise<BlogError> {
    const blog = await this.repo.get(command.blogId);
    if (!blog) return BlogError.NotFound;

    if (blog.banInfo?.isBanned === command.data.isBanned)
      return BlogError.NoError;

    return this.putBan(blog.id, command.data.isBanned);
  }
  private async putBan(blogId: string, isBanned: boolean): Promise<BlogError> {
    const banInfo = BlogModel.createBanInfo(isBanned);
    let result = await this.repo.update(blogId, { banInfo });
    result &&= await this.postsRepo.setBlogBan(blogId, isBanned);
    return result ? BlogError.NoError : BlogError.NotFound;
  }
}
