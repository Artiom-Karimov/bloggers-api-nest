import { Injectable } from '@nestjs/common';
import PageViewModel from '../../../common/models/page.view.model';
import AdminBlogViewModel from './models/view/admin.blog.view.model';
import GetBlogsQuery from './models/input/get.blogs.query';

@Injectable()
export default abstract class AdminBlogsQueryRepository {
  public abstract getAdminBlogs(
    params: GetBlogsQuery,
  ): Promise<PageViewModel<AdminBlogViewModel>>;
  public abstract getAdminBlog(
    id: string,
  ): Promise<AdminBlogViewModel | undefined>;
}
