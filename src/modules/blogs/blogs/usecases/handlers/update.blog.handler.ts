import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogsRepository from '../../interfaces/blogs.repository';
import UpdateBlogCommand from '../commands/update.blog.command';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogHandler implements ICommandHandler<UpdateBlogCommand> {
  constructor(private readonly repo: BlogsRepository) { }

  async execute(command: UpdateBlogCommand): Promise<void> {
    const blog = await this.repo.get(command.blogId);
    if (!blog) throw new NotFoundException('blog not found');
    if (blog.ownerId !== command.bloggerId)
      throw new ForbiddenException('blog is owned by another user');

    blog.updateData(command.data);
    const result = await this.repo.update(blog);

    if (!result) throw new BadRequestException('cannot update blog');
  }
}
