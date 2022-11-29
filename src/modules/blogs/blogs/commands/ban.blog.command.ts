import BlogBanInputModel from '../models/input/blog.ban.input.model';

export default class BanBlogCommand {
  constructor(public blogId: string, public data: BlogBanInputModel) { }
}
