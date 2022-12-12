import { Injectable } from '@nestjs/common';
import PageViewModel from '../../../common/models/page.view.model';
import BlogViewModel from './models/view/blog.view.model';
import GetBlogsQuery from './models/input/get.blogs.query';

@Injectable()
export default abstract class BlogsQueryRepository {
  public abstract getBlogs(
    params: GetBlogsQuery,
  ): Promise<PageViewModel<BlogViewModel>>;
  public abstract getBloggerBlogs(
    params: GetBlogsQuery,
    bloggerId: string,
  ): Promise<PageViewModel<BlogViewModel>>;
  public abstract getBlog(id: string): Promise<BlogViewModel | undefined>;
}
