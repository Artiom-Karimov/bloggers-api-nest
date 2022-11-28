import AdminBlogViewModel from './admin.blog.view.model';
import BlogModel, { BlogBanInfo, BlogOwnerInfo } from './blog.model';
import Blog from './blog.schema';
import BlogViewModel from './blog.view.model';

export default class BlogMapper {
  public static fromDomain(model: BlogModel): Blog {
    return new Blog(
      model.id,
      model.name,
      model.description,
      model.websiteUrl,
      model.createdAt,
      model.ownerInfo,
      model.banInfo,
    );
  }
  public static toDomain(model: Blog): BlogModel {
    return new BlogModel(
      model._id,
      model.name,
      model.description,
      model.websiteUrl,
      model.createdAt,
      BlogMapper.getOwnerInfo(model),
      BlogMapper.getBanInfo(model),
    );
  }
  public static toView(model: Blog): BlogViewModel {
    return new BlogViewModel(
      model._id,
      model.name,
      model.description,
      model.websiteUrl,
      model.createdAt,
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
    if (!model.ownerInfo)
      return {
        userId: null,
        userLogin: null,
      };
    return {
      userId: model.ownerInfo.userId,
      userLogin: model.ownerInfo.userLogin,
    };
  }
  private static getBanInfo(model: Blog): BlogBanInfo {
    if (!model.banInfo)
      return {
        isBanned: false,
        banDate: null,
      };
    return {
      isBanned: model.banInfo.isBanned,
      banDate: model.banInfo.banDate,
    };
  }
}
