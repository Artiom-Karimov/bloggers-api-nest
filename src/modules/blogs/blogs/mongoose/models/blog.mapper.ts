import AdminBlogViewModel from '../../models/view/admin.blog.view.model';
import BlogModel, { BlogBanInfo, BlogOwnerInfo } from '../../models/blog.model';
import Blog from './blog.schema';
import BlogViewModel from '../../models/view/blog.view.model';
import BlogDto from '../../models/blog.dto';

export default class BlogMapper {
  public static fromDomain(model: BlogModel): Blog {
    const dto = model.toDto();
    return new Blog(
      dto.id,
      dto.name,
      dto.description,
      dto.websiteUrl,
      dto.createdAt,
      dto.ownerInfo,
      dto.banInfo,
    );
  }
  public static toDomain(model: Blog): BlogModel {
    const dto = new BlogDto(
      model._id,
      model.name,
      model.description,
      model.websiteUrl,
      model.createdAt,
      BlogMapper.getOwnerInfo(model),
      BlogMapper.getBanInfo(model),
    );
    return new BlogModel(dto);
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
