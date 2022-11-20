import AdminBlogViewModel from './admin.blog.view.model';
import BlogModel, { BlogOwnerInfo } from './blog.model';
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
    );
  }
  private static getOwnerInfo(model: Blog): BlogOwnerInfo {
    if (!model.ownerInfo) return undefined;
    return {
      userId: model.ownerInfo.userId,
      userLogin: model.ownerInfo.userLogin,
    };
  }
}
