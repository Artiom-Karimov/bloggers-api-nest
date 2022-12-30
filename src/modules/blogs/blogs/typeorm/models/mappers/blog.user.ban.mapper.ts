import BlogUserBanDto from '../../models/blog.user.ban.dto';
import BlogUserBanModel from '../../models/blog.user.ban.model';
import BlogUserBanViewModel from '../../../models/view/blog.user.ban.view.model';
import { BlogUserBan } from '../../../sql/models/blog.user.ban';

export default class BlogUserBanMapper {
  public static fromDomain(model: BlogUserBanModel): BlogUserBan {
    const dto = model.toDto();
    return new BlogUserBan(
      dto.blogId,
      dto.userId,
      dto.userLogin,
      dto.isBanned,
      dto.banReason,
      new Date(dto.banDate),
    );
  }
  public static toDomain(model: BlogUserBan): BlogUserBanModel {
    return new BlogUserBanModel(
      new BlogUserBanDto(
        model.blogId + model.userId,
        model.blogId,
        model.userId,
        model.userLogin,
        model.isBanned,
        model.banReason,
        model.banDate?.toISOString(),
      ),
    );
  }
  public static toView(model: BlogUserBan): BlogUserBanViewModel {
    return new BlogUserBanViewModel(model.userId, model.userLogin, {
      isBanned: model.isBanned,
      banReason: model.banReason,
      banDate: model.banDate.toISOString(),
    });
  }
}
