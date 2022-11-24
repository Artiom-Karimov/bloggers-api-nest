import BlogInputModel from '../models/blog.input.model';

export default class UpdateBlogCommand {
  constructor(
    public blogId: string,
    public data: BlogInputModel,
    public bloggerId: string,
  ) { }
}
