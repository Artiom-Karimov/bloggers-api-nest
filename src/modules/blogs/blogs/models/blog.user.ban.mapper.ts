import BlogUserBanModel from './blog.user.ban.model';
import BlogUserBan from './blog.user.ban.schema';
import BlogUserBanViewModel from './view/blog.user.ban.view.model';

export default class BlogUserBanMapper {
  public static fromDomain(model: BlogUserBanModel): BlogUserBan {
    return new BlogUserBan(
      model.id,
      model.blogId,
      model.userId,
      model.userLogin,
      model.isBanned,
      model.banReason,
      model.banDate,
    );
  }
  public static toDomain(model: BlogUserBan): BlogUserBanModel {
    return new BlogUserBanModel(
      model._id,
      model.blogId,
      model.userId,
      model.userLogin,
      model.isBanned,
      model.banReason,
      model.banDate,
    );
  }
  public static toView(model: BlogUserBan): BlogUserBanViewModel {
    return new BlogUserBanViewModel(model.userId, model.userLogin, {
      isBanned: model.isBanned,
      banReason: model.banReason,
      banDate: model.banDate,
    });
  }
}
