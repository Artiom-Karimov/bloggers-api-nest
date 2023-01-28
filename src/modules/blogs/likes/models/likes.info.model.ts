import { ApiProperty } from '@nestjs/swagger';
import { LikeStatus } from './like.input.model';

export class LikesInfoModel {
  @ApiProperty()
  public likesCount: number;
  @ApiProperty()
  public dislikesCount: number;
  @ApiProperty()
  public myStatus: LikeStatus;

  constructor(
    likesCount = 0,
    dislikesCount = 0,
    myStatus: LikeStatus = LikeStatus.None,
  ) {
    this.likesCount = likesCount;
    this.dislikesCount = dislikesCount;
    this.myStatus = myStatus;
  }
}

export class LikeViewModel {
  @ApiProperty()
  public addedAt: string;
  @ApiProperty()
  public userId: string;
  @ApiProperty()
  public login: string;

  constructor(addedAt: string, userId: string, login: string) {
    this.addedAt = addedAt;
    this.userId = userId;
    this.login = login;
  }
}

export class ExtendedLikesInfoModel extends LikesInfoModel {
  @ApiProperty({ type: LikeViewModel, isArray: true })
  public newestLikes: LikeViewModel[];

  constructor(
    likesCount = 0,
    dislikesCount = 0,
    myStatus: LikeStatus = LikeStatus.None,
    newestLikes: LikeViewModel[] = [],
  ) {
    super(likesCount, dislikesCount, myStatus);
    this.newestLikes = newestLikes;
  }
}
