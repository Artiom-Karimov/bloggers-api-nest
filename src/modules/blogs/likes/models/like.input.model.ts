import { IsEnum, IsNotEmpty } from 'class-validator';

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export default class LikeInputModel {
  entityId?: string;
  userId?: string;
  userLogin?: string;

  @IsNotEmpty()
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
