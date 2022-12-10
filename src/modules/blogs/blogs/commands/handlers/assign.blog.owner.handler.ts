import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import UsersQueryRepository from '../../../../users/interfaces/users.query.repository';
import BlogsRepository from '../../blogs.repository';
import { BlogError } from '../../models/blog.error';
import AssignBlogOwnerCommand from '../commands/assign.blog.owner.command';

@CommandHandler(AssignBlogOwnerCommand)
export class AssignBlogOwnerHandler
  implements ICommandHandler<AssignBlogOwnerCommand>
{
  constructor(
    private readonly repo: BlogsRepository,
    private readonly usersRepo: UsersQueryRepository,
  ) { }

  async execute(command: AssignBlogOwnerCommand): Promise<BlogError> {
    const user = await this.usersRepo.getUser(command.bloggerId);
    if (!user) return BlogError.NotFound;

    const blog = await this.repo.get(command.blogId);
    if (!blog) return BlogError.NotFound;

    try {
      blog.ownerInfo = {
        userId: user.id,
        userLogin: user.login,
      };
    } catch (error) {
      return BlogError.Forbidden;
    }

    const result = await this.repo.update(blog);
    return result ? BlogError.NoError : BlogError.Unknown;
  }
}
