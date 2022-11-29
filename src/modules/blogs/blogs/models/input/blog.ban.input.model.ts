import { IsBoolean } from 'class-validator';

export default class BlogBanInputModel {
  @IsBoolean()
  isBanned: boolean;
}
