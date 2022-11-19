import BlogModel from './blog.model';
import Blog from './blog.schema';
import BlogViewModel from './blog.view.model';

export default class BlogMapper {
  public static fromDomain(model: BlogModel): Blog {
    const blog = new Blog();
    blog._id = model.id;
    blog.name = model.name;
    blog.description = model.description;
    blog.websiteUrl = model.websiteUrl;
    blog.createdAt = model.createdAt;
    return blog;
  }
  public static toDomain(model: Blog): BlogModel {
    return new BlogModel(
      model._id,
      model.name,
      model.description,
      model.websiteUrl,
      model.createdAt,
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
}
