import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import SessionsRepository from '../../../users/interfaces/sessions.repository';
import { BlogError } from '../../../blogs/blogs/models/blog.error';
import CommentsRepository from '../../../blogs/comments/interfaces/comments.repository';
import CommentLikesRepository from '../../../blogs/likes/interfaces/comment.likes.repository';
import PostLikesRepository from '../../../blogs/likes/interfaces/post.likes.repository';
import UsersBanRepository from '../../../users/interfaces/users.ban.repository';
import UsersRepository from '../../../users/interfaces/users.repository';
import BanUserCommand, {
  BanUserCreateModel,
} from '../commands/ban.user.command';
import { UserBan } from '../../../users/typeorm/models/user.ban';

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
    let ban = await this.banRepo.get(user.id);

    if (ban) ban.setBan(data);
    else ban = UserBan.create(data, user);
    const created = await this.banRepo.createOrUpdate(ban);

    if (ban.isBanned) await this.sessionsRepo.deleteAll(user.id);

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
