import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import CommentsRepository from '../../../comments/interfaces/comments.repository';
import BlogUserBanRepository from '../../interfaces/blog.user.ban.repository';
import BlogsRepository from '../../interfaces/blogs.repository';
import BlogUserBanCommand from '../commands/blog.user.ban.command';
import { BlogUserBan } from '../../typeorm/models/blog.user.ban';
import { Blog } from '../../typeorm/models/blog';
import { User } from '../../../../users/typeorm/models/user';
import UsersRepository from '../../../../users/interfaces/users.repository';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

@CommandHandler(BlogUserBanCommand)
export class BlogUserBanHandler implements ICommandHandler<BlogUserBanCommand> {
  constructor(
    private readonly blogRepo: BlogsRepository,
    private readonly commentRepo: CommentsRepository,
    private readonly banRepo: BlogUserBanRepository,
    private readonly usersRepo: UsersRepository,
  ) { }

  async execute(command: BlogUserBanCommand): Promise<void> {
    const { blogId, bloggerId, isBanned, userId, banReason } = command.data;
    const blog = await this.blogRepo.get(blogId);
    if (!blog) throw new NotFoundException('blog not found');
    if (blog.ownerId !== bloggerId)
      throw new ForbiddenException('operation not allowed');

    const user = await this.usersRepo.get(userId);
    if (!user) throw new NotFoundException('user not found');

    if (isBanned) return this.create(banReason, blog, user);
    return this.delete(blogId, userId);
  }

  private async create(
    banReason: string,
    blog: Blog,
    user: User,
  ): Promise<void> {
    const alreadyCreated = await this.banRepo.get(blog.id, user.id);
    if (alreadyCreated) return;

    const ban = BlogUserBan.create(banReason, blog, user);
    const result = await this.banRepo.create(ban);
    await this.commentRepo.banByBlogger(user.id, blog.id, true);
    if (!result) throw new BadRequestException('cannot create ban');
  }
  private async delete(blogId: string, userId: string): Promise<void> {
    const result = await this.banRepo.delete(blogId, userId);
    await this.commentRepo.banByBlogger(userId, blogId, false);
    if (!result) throw new BadRequestException('cannot remove ban');
  }
}
