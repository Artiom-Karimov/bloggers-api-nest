import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CommentsRepository from '../../../comments/interfaces/comments.repository';
import BlogUserBanRepository from '../../interfaces/blog.user.ban.repository';
import BlogsRepository from '../../interfaces/blogs.repository';
import { BlogError } from '../../models/blog.error';
import BlogUserBanCommand from '../commands/blog.user.ban.command';
import { BlogUserBan } from '../../typeorm/models/blog.user.ban';
import { Blog } from '../../typeorm/models/blog';
import { User } from '../../../../users/typeorm/models/user';
import UsersRepository from '../../../../users/interfaces/users.repository';

@CommandHandler(BlogUserBanCommand)
export class BlogUserBanHandler implements ICommandHandler<BlogUserBanCommand> {
  constructor(
    private readonly blogRepo: BlogsRepository,
    private readonly commentRepo: CommentsRepository,
    private readonly banRepo: BlogUserBanRepository,
    private readonly usersRepo: UsersRepository,
  ) { }

  async execute(command: BlogUserBanCommand): Promise<BlogError> {
    const { blogId, bloggerId, isBanned, userId, banReason } = command.data;
    const blog = await this.blogRepo.get(blogId);
    if (!blog) return BlogError.NotFound;
    if (blog.ownerId !== bloggerId) return BlogError.Forbidden;

    const user = await this.usersRepo.get(userId);
    if (!user) return BlogError.NotFound;

    if (isBanned) return this.create(banReason, blog, user);
    return this.delete(blogId, userId);
  }

  private async create(
    banReason: string,
    blog: Blog,
    user: User,
  ): Promise<BlogError> {
    const alreadyCreated = await this.banRepo.get(blog.id, user.id);
    if (alreadyCreated) return BlogError.NoError;

    const ban = BlogUserBan.create(banReason, blog, user);
    const result = await this.banRepo.create(ban);
    await this.commentRepo.banByBlogger(user.id, blog.id, true);
    return result ? BlogError.NoError : BlogError.Unknown;
  }
  private async delete(blogId: string, userId: string): Promise<BlogError> {
    await this.banRepo.delete(blogId, userId);
    await this.commentRepo.banByBlogger(userId, blogId, false);
    return BlogError.NoError;
  }
}
