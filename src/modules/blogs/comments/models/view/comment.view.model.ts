import { ApiProperty } from '@nestjs/swagger';
import { LikesInfoModel } from '../../../likes/models/likes.info.model';

export default class CommentViewModel {
  @ApiProperty()
  public id: string;
  @ApiProperty()
  public content: string;
  @ApiProperty()
  public userId: string;
  @ApiProperty()
  public userLogin: string;
  @ApiProperty()
  public createdAt: string;
  @ApiProperty()
  public likesInfo: LikesInfoModel;

  constructor(
    id: string,
    content: string,
    userId: string,
    userLogin: string,
    createdAt: string,
    likesInfo: LikesInfoModel = new LikesInfoModel(),
  ) {
    this.id = id;
    this.content = content;
    this.userId = userId;
    this.userLogin = userLogin;
    this.createdAt = createdAt;
    this.likesInfo = likesInfo;
  }
}
