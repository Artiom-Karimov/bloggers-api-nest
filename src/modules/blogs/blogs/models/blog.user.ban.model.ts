import DateGenerator from '../../../../common/utils/date.generator';
import IdGenerator from '../../../../common/utils/id.generator';
import { BlogUserBanCreateModel } from '../commands/blog.user.ban.command';

export default class BlogUserBanModel {
  constructor(
    public id: string,
    public blogId: string,
    public userId: string,
    public userLogin: string,
    public isBanned: boolean,
    public banReason: string,
    public banDate: string,
  ) { }
  public static create(data: BlogUserBanCreateModel): BlogUserBanModel {
    return new BlogUserBanModel(
      IdGenerator.generate(),
      data.blogId,
      data.userId,
      data.userLogin,
      data.isBanned,
      data.banReason,
      DateGenerator.generate(),
    );
  }
}
