import BlogUserBanDto from '../../models/blog.user.ban.dto';
import BlogUserBanModel from '../../models/blog.user.ban.model';
import BlogUserBan from './blog.user.ban.schema';
import BlogUserBanViewModel from '../../models/view/blog.user.ban.view.model';

export default class BlogUserBanMapper {
  public static fromDomain(model: BlogUserBanModel): BlogUserBan {
    const dto = model.toDto();
    return new BlogUserBan(
      dto.id,
      dto.blogId,
      dto.userId,
      dto.userLogin,
      dto.isBanned,
      dto.banReason,
      dto.banDate,
    );
  }
  public static toDomain(model: BlogUserBan): BlogUserBanModel {
    return new BlogUserBanModel(
      new BlogUserBanDto(
        model._id,
        model.blogId,
        model.userId,
        model.userLogin,
        model.isBanned,
        model.banReason,
        model.banDate,
      ),
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
