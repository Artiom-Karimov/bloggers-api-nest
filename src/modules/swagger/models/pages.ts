import { ApiProperty } from '@nestjs/swagger';
import BlogViewModel from '../../blogs/blogs/models/view/blog.view.model';
import PageViewModel from '../../../common/models/page.view.model';
import PostViewModel from '../../blogs/posts/models/post.view.model';
import CommentViewModel from '../../blogs/comments/models/view/comment.view.model';

export class BlogPage extends PageViewModel<BlogViewModel> {
  @ApiProperty({ type: BlogViewModel, isArray: true })
  public items: BlogViewModel[];
}
export class PostPage extends PageViewModel<PostViewModel> {
  @ApiProperty({ type: PostViewModel, isArray: true })
  public items: PostViewModel[];
}
export class CommentPage extends PageViewModel<CommentViewModel> {
  @ApiProperty({ type: PostViewModel, isArray: true })
  public items: CommentViewModel[];
}
