import Comment from './comment';

export default class CommentWithPost extends Comment {
  public postId: string;
  public postTitle: string;
  public blogId: string;
  public blogName: string;
}
