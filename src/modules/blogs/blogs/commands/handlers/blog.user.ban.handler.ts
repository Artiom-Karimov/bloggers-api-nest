import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import UsersQueryRepository from '../../../../users/users.query.repository';
import CommentsRepository from '../../../comments/comments.repository';
import BlogUserBanRepository from '../../blog.user.ban.repository';
import BlogsRepository from '../../blogs.repository';
import { BlogError } from '../../models/blog.error';
import BlogUserBanModel from '../../models/blog.user.ban.model';
import BlogUserBanCommand, {
  BlogUserBanCreateModel,
} from '../commands/blog.user.ban.command';

@CommandHandler(BlogUserBanCommand)
export class BlogUserBanHandler implements ICommandHandler<BlogUserBanCommand> {
  constructor(
    private readonly blogRepo: BlogsRepository,
    private readonly commentRepo: CommentsRepository,
    private readonly banRepo: BlogUserBanRepository,
    private readonly usersRepo: UsersQueryRepository,
  ) { }

  async execute(command: BlogUserBanCommand): Promise<BlogError> {
    const { blogId, bloggerId, isBanned, userId } = command.data;
    const blog = await this.blogRepo.get(blogId);
    if (!blog) return BlogError.NotFound;
    if (blog.ownerInfo?.userId !== bloggerId) return BlogError.Forbidden;

    const user = await this.usersRepo.getUser(userId);
    if (!user) return BlogError.NotFound;

    command.data.userLogin = user.login;

    if (isBanned) return this.create(command.data);
    return this.delete(blogId, userId);
  }

  private async create(data: BlogUserBanCreateModel): Promise<BlogError> {
    const alreadyCreated = await this.banRepo.get(data.blogId, data.userId);
    if (alreadyCreated) return BlogError.NoError;

    const ban = BlogUserBanModel.create(data);
    const result = await this.banRepo.create(ban);
    await this.commentRepo.banByBlogger(data.userId, data.blogId, true);
    return result ? BlogError.NoError : BlogError.Unknown;
  }
  private async delete(blogId: string, userId: string): Promise<BlogError> {
    await this.banRepo.delete(blogId, userId);
    await this.commentRepo.banByBlogger(userId, blogId, false);
    return BlogError.NoError;
  }
}
