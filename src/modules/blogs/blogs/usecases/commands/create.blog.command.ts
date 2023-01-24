import BlogInputModel from '../../models/input/blog.input.model';

export default class CreateBlogCommand {
  constructor(public data: BlogInputModel, public ownerId?: string) { }
}
