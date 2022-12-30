import AdminBlogViewModel, {
  BlogBanInfo,
  BlogOwnerInfo,
} from '../../../models/view/admin.blog.view.model';
import BlogViewModel from '../../../models/view/blog.view.model';
import { Blog } from '../blog';

export default class BlogMapper {
  public static toView(model: Blog): BlogViewModel {
    return new BlogViewModel(
      model.id,
      model.name,
      model.description,
      model.websiteUrl,
      model.createdAt.toISOString(),
    );
  }
  public static toAdminView(model: Blog): AdminBlogViewModel {
    return new AdminBlogViewModel(
      BlogMapper.toView(model),
      BlogMapper.getOwnerInfo(model),
      BlogMapper.getBanInfo(model),
    );
  }
  private static getOwnerInfo(model: Blog): BlogOwnerInfo {
    if (!model.owner)
      return {
        userId: null,
        userLogin: null,
      };
    return {
      userId: model.ownerId,
      userLogin: model.ownerLogin,
    };
  }
  private static getBanInfo(model: Blog): BlogBanInfo {
    if (!model.banDate)
      return {
        isBanned: false,
        banDate: null,
      };
    return {
      isBanned: model.isBanned,
      banDate: model.banDate.toISOString(),
    };
  }
}
