import BlogInputModel from '../models/input/blog.input.model';
import { BlogOwnerInfo } from '../models/blog.model';

export default class CreateBlogCommand {
  constructor(public data: BlogInputModel, public owner?: BlogOwnerInfo) { }
}
