import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogsRepository from '../../interfaces/blogs.repository';
import BanBlogCommand from '../commands/ban.blog.command';
import { BadRequestException, NotFoundException } from '@nestjs/common';

@CommandHandler(BanBlogCommand)
export class BanBlogHandler implements ICommandHandler<BanBlogCommand> {
  constructor(private readonly repo: BlogsRepository) { }

  async execute(command: BanBlogCommand): Promise<void> {
    const blog = await this.repo.get(command.blogId);
    if (!blog) throw new NotFoundException('blog not found');

    if (blog.isBanned === command.data.isBanned) return;
    blog.isBanned = command.data.isBanned;
    const result = await this.repo.update(blog);

    if (!result) throw new BadRequestException('something went wrong');
  }
}
