import AdminBlogViewModel from '../../models/view/admin.blog.view.model';
import BlogModel, { BlogBanInfo, BlogOwnerInfo } from '../../models/blog.model';
import BlogViewModel from '../../models/view/blog.view.model';
import BlogDto from '../../models/blog.dto';
import { Blog } from './blog';

export default class BlogMapper {
  public static fromDomain(model: BlogModel): Blog {
    const dto = model.toDto();
    return new Blog(
      dto.id,
      dto.name,
      dto.description,
      dto.websiteUrl,
      new Date(dto.createdAt),
      dto.ownerInfo?.userId,
      dto.ownerInfo?.userLogin,
      dto.banInfo?.isBanned,
      dto.banInfo?.banDate ? new Date(dto.banInfo.banDate) : null,
    );
  }
  public static toDomain(model: Blog): BlogModel {
    const dto = new BlogDto(
      model.id,
      model.name,
      model.description,
      model.websiteUrl,
      model.createdAt.toISOString(),
      BlogMapper.getOwnerInfo(model),
      BlogMapper.getBanInfo(model),
    );
    return new BlogModel(dto);
  }
  public static toView(model: Partial<Blog>): BlogViewModel {
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
    if (!model.userId)
      return {
        userId: null,
        userLogin: null,
      };
    return {
      userId: model.userId,
      userLogin: model.userLogin,
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
