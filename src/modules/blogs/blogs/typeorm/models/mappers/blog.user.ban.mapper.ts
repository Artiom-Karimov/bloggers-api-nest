import BlogUserBanViewModel from '../../../models/view/blog.user.ban.view.model';
import { BlogUserBan } from '../blog.user.ban';

export default class BlogUserBanMapper {
  public static toView(model: BlogUserBan): BlogUserBanViewModel {
    return new BlogUserBanViewModel(model.userId, model.userLogin, {
      isBanned: model.isBanned,
      banReason: model.banReason,
      banDate: model.banDate.toISOString(),
    });
  }
}
