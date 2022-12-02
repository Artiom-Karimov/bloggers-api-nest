import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogsRepository from '../../blogs.repository';
import { BlogError } from '../../models/blog.error';
import DeleteBlogCommand from '../commands/delete.blog.command';

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogHandler implements ICommandHandler<DeleteBlogCommand> {
  constructor(private readonly repo: BlogsRepository) { }

  async execute(command: DeleteBlogCommand): Promise<BlogError> {
    const blog = await this.repo.get(command.blogId);
    if (!blog) return BlogError.NotFound;
    if (!blog.ownerInfo || blog.ownerInfo.userId !== command.bloggerId)
      return BlogError.Forbidden;
    const result = await this.repo.delete(command.blogId);
    return result ? BlogError.NoError : BlogError.Unknown;
  }
}
