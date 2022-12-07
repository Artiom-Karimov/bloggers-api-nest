import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import UsersQueryRepository from '../../../../users/users.query.repository';
import BlogsRepository from '../../blogs.repository';
import { BlogError } from '../../models/blog.error';
import { BlogOwnerInfo } from '../../models/blog.model';
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
    if (blog.ownerInfo) return BlogError.Forbidden;

    const ownerInfo: BlogOwnerInfo = {
      userId: user.id,
      userLogin: user.login,
    };

    const result = await this.repo.update(command.blogId, { ownerInfo });
    return result ? BlogError.NoError : BlogError.Unknown;
  }
}
