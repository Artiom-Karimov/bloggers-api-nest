import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogsRepository from '../../interfaces/blogs.repository';
import { BlogError } from '../../models/blog.error';
import AssignBlogOwnerCommand from '../commands/assign.blog.owner.command';
import UsersRepository from '../../../../users/interfaces/users.repository';

@CommandHandler(AssignBlogOwnerCommand)
export class AssignBlogOwnerHandler
  implements ICommandHandler<AssignBlogOwnerCommand>
{
  constructor(
    private readonly repo: BlogsRepository,
    private readonly usersRepo: UsersRepository,
  ) { }

  async execute(command: AssignBlogOwnerCommand): Promise<BlogError> {
    const blog = await this.repo.get(command.blogId);
    if (!blog) return BlogError.NotFound;

    const user = await this.usersRepo.get(command.bloggerId);
    if (!user) return BlogError.NotFound;

    try {
      blog.assignOwner(user);
    } catch (error) {
      return BlogError.Forbidden;
    }

    const result = await this.repo.update(blog);
    return result ? BlogError.NoError : BlogError.Unknown;
  }
}
