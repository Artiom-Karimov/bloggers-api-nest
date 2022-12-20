import { IsOptional, Matches } from 'class-validator';
import { regex } from '../utils/validation.regex';

export default class IdParams {
  @IsOptional()
  @Matches(regex.uuid)
  id?: string;

  @IsOptional()
  @Matches(regex.uuid)
  blogId?: string;

  @IsOptional()
  @Matches(regex.uuid)
  postId?: string;

  @IsOptional()
  @Matches(regex.uuid)
  userId?: string;

  @IsOptional()
  @Matches(regex.uuid)
  deviceId?: string;
}
