import BlogInputModel from '../models/blog.input.model';
import { BlogOwnerInfo } from '../models/blog.model';

export default class CreateBlogCommand {
  constructor(public data: BlogInputModel, public owner?: BlogOwnerInfo) { }
}
