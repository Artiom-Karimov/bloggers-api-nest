import { Transform, TransformFnParams } from 'class-transformer';
import { Matches, MinLength, MaxLength } from 'class-validator';

export default class BlogInputModel {
  @MinLength(3)
  @MaxLength(15)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  name: string;

  @MinLength(5)
  @MaxLength(100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  youtubeUrl: string;
}
