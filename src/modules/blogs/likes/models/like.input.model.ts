import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum LikeStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export default class LikeInputModel {
  @IsNotEmpty()
  @IsEnum(LikeStatus)
  @ApiProperty({ enum: LikeStatus })
  likeStatus: LikeStatus;
}
