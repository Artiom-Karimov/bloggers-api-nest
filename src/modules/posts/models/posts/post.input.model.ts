import { MaxLength, MinLength } from 'class-validator';

export default class PostInputModel {
  @MinLength(3)
  @MaxLength(30)
  title: string;

  @MinLength(3)
  @MaxLength(100)
  shortDescription: string;

  @MinLength(3)
  @MaxLength(1000)
  content: string;

  blogId?: string;

  blogName?: string;
}
