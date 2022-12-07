import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import SessionsRepository from '../../../auth/sessions.repository';
import { BlogError } from '../../../blogs/blogs/models/blog.error';
import CommentsRepository from '../../../blogs/comments/comments.repository';
import CommentLikesRepository from '../../../blogs/likes/comment.likes.repository';
import PostLikesRepository from '../../../blogs/likes/post.likes.repository';
import UserBanModel from '../../../users/models/user.ban.model';
import UsersBanRepository from '../../../users/users.ban.repository';
import UsersRepository from '../../../users/users.repository';
import BanUserCommand, {
  BanUserCreateModel,
} from '../commands/ban.user.command';

@CommandHandler(BanUserCommand)
export class BanUserHandler implements ICommandHandler<BanUserCommand> {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly banRepo: UsersBanRepository,
    private readonly sessionsRepo: SessionsRepository,
    private readonly postLikesRepo: PostLikesRepository,
    private readonly commentsRepo: CommentsRepository,
    private readonly commentLikesRepo: CommentLikesRepository,
  ) { }

  async execute(command: BanUserCommand): Promise<BlogError> {
    const userBanResult = await this.setUserBan(command.data);
    if (userBanResult !== BlogError.NoError) return userBanResult;

    await this.setCommentsBan(command.data);
    await this.setLikesBan(command.data);

    return BlogError.NoError;
  }

  private async setUserBan(data: BanUserCreateModel): Promise<BlogError> {
    const user = await this.usersRepo.get(data.userId);
    if (!user) return BlogError.NotFound;

    if (!data.isBanned) {
      await this.banRepo.delete(user.id);
      return BlogError.NoError;
    }

    await this.sessionsRepo.deleteAll(user.id);

    const model = UserBanModel.create(data);
    const created = await this.banRepo.createOrUpdate(model);

    return created ? BlogError.NoError : BlogError.Unknown;
  }
  private async setCommentsBan(data: BanUserCreateModel): Promise<void> {
    await this.commentsRepo.banByAdmin(data.userId, data.isBanned);
  }
  private async setLikesBan(data: BanUserCreateModel): Promise<void> {
    await this.postLikesRepo.setUserBanned(data.userId, data.isBanned);
    await this.commentLikesRepo.setUserBanned(data.userId, data.isBanned);
  }
}
