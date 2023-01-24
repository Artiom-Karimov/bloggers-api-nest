import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogsRepository from '../../interfaces/blogs.repository';
import DeleteBlogCommand from '../commands/delete.blog.command';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogHandler implements ICommandHandler<DeleteBlogCommand> {
  constructor(private readonly repo: BlogsRepository) { }

  async execute(command: DeleteBlogCommand): Promise<void> {
    const blog = await this.repo.get(command.blogId);
    if (!blog) throw new NotFoundException('blog not found');
    if (blog.ownerId !== command.bloggerId)
      throw new ForbiddenException('blog is owned by another user');

    const result = await this.repo.delete(command.blogId);

    if (!result) throw new BadRequestException('cannot delete blog');
  }
}
