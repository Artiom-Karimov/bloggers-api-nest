import { ApiProperty } from '@nestjs/swagger';
import BlogViewModel from '../../blogs/blogs/models/view/blog.view.model';
import PageViewModel from '../../../common/models/page.view.model';
import PostViewModel from '../../blogs/posts/models/post.view.model';

export class SwaggerBlogPage extends PageViewModel<BlogViewModel> {
  @ApiProperty({ type: BlogViewModel, isArray: true })
  public items: BlogViewModel[];
}
export class SwaggerPostPage extends PageViewModel<PostViewModel> {
  @ApiProperty({ type: PostViewModel, isArray: true })
  public items: PostViewModel[];
}
