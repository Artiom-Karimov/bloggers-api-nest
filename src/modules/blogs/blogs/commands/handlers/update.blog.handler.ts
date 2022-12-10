import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogsRepository from '../../blogs.repository';
import { BlogError } from '../../models/blog.error';
import UpdateBlogCommand from '../commands/update.blog.command';

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogHandler implements ICommandHandler<UpdateBlogCommand> {
  constructor(private readonly repo: BlogsRepository) { }

  async execute(command: UpdateBlogCommand): Promise<BlogError> {
    const blog = await this.repo.get(command.blogId);
    if (!blog) return BlogError.NotFound;
    if (blog.ownerId !== command.bloggerId) return BlogError.Forbidden;

    blog.updateData(command.data);
    const result = await this.repo.update(blog);

    return result ? BlogError.NoError : BlogError.Unknown;
  }
}
