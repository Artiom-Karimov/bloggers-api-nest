import { MaxLength, MinLength } from 'class-validator';

export default class CommentInputModel {
  postId: string;
  userId: string;
  userLogin: string;

  @MinLength(20)
  @MaxLength(300)
  content: string;
}
