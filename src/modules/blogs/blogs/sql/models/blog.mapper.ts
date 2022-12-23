import AdminBlogViewModel, {
  BlogBanInfo,
  BlogOwnerInfo,
} from '../../models/view/admin.blog.view.model';
import BlogModel from '../../models/blog.model';
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
      dto.createdAt,
      dto.ownerId,
      null,
      dto.isBanned,
      dto.banDate,
    );
  }
  public static toDomain(model: Blog): BlogModel {
    const dto = new BlogDto(
      model.id,
      model.name,
      model.description,
      model.websiteUrl,
      model.createdAt,
      model.userId,
      model.isBanned,
      model.banDate,
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
