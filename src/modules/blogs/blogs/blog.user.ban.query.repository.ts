import { Injectable } from '@nestjs/common';
import PageViewModel from '../../../common/models/page.view.model';
import GetBlogUserBansQuery from './models/input/get.blog.user.bans.query';
import BlogUserBanViewModel from './models/view/blog.user.ban.view.model';

@Injectable()
export default abstract class BlogUserBanQueryRepository {
  public abstract getUsers(
    params: GetBlogUserBansQuery,
  ): Promise<PageViewModel<BlogUserBanViewModel>>;
}
