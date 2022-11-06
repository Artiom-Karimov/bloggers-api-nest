import { Matches, MinLength, MaxLength } from 'class-validator';

export default class BlogInputModel {
  @MinLength(3)
  @MaxLength(15)
  name: string;

  @MinLength(5)
  @MaxLength(100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  youtubeUrl: string;
}
