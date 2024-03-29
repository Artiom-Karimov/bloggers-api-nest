import { ApiProperty } from '@nestjs/swagger';
import BlogViewModel from '../../blogs/blogs/models/view/blog.view.model';
import PageViewModel from '../../../common/models/page.view.model';
import PostViewModel from '../../blogs/posts/models/post.view.model';
import CommentViewModel from '../../blogs/comments/models/view/comment.view.model';
import BloggerCommentViewModel from '../../blogs/comments/models/view/blogger.comment.view.model';
import BlogUserBanViewModel from '../../blogs/blogs/models/view/blog.user.ban.view.model';
import AdminBlogViewModel from '../../blogs/blogs/models/view/admin.blog.view.model';
import UserViewModel from '../../users/models/view/user.view.model';
import { QuestionViewModel } from '../../quiz/models/view/question.view.model';
import { QuizViewModel } from '../../quiz/models/view/quiz.view.model';

export class BlogPage extends PageViewModel<BlogViewModel> {
  @ApiProperty({ type: BlogViewModel, isArray: true })
  public items: BlogViewModel[];
}
export class PostPage extends PageViewModel<PostViewModel> {
  @ApiProperty({ type: PostViewModel, isArray: true })
  public items: PostViewModel[];
}
export class CommentPage extends PageViewModel<CommentViewModel> {
  @ApiProperty({ type: CommentViewModel, isArray: true })
  public items: CommentViewModel[];
}
export class BloggerCommentPage extends PageViewModel<BloggerCommentViewModel> {
  @ApiProperty({ type: BloggerCommentViewModel, isArray: true })
  public items: BloggerCommentViewModel[];
}
export class BloggerUserBanPage extends PageViewModel<BlogUserBanViewModel> {
  @ApiProperty({ type: BlogUserBanViewModel, isArray: true })
  public items: BlogUserBanViewModel[];
}
export class AdminBlogPage extends PageViewModel<AdminBlogViewModel> {
  @ApiProperty({ type: AdminBlogViewModel, isArray: true })
  public items: AdminBlogViewModel[];
}
export class AdminUserPage extends PageViewModel<UserViewModel> {
  @ApiProperty({ type: UserViewModel, isArray: true })
  public items: UserViewModel[];
}
export class AdminQuestionPage extends PageViewModel<QuestionViewModel> {
  @ApiProperty({ type: QuestionViewModel, isArray: true })
  public items: QuestionViewModel[];
}
export class QuizPage extends PageViewModel<QuizViewModel> {
  @ApiProperty({ type: QuizViewModel, isArray: true })
  public items: QuizViewModel[];
}
