import { LikeStatus } from './like.input.model';

export class LikesInfoModel {
  constructor(
    public likesCount = 0,
    public dislikesCount = 0,
    public myStatus: LikeStatus = LikeStatus.None,
  ) { }
}

export class LikeViewModel {
  constructor(
    public addedAt: string,
    public userId: string,
    public login: string,
  ) { }
}

export class ExtendedLikesInfoModel extends LikesInfoModel {
  constructor(
    likesCount = 0,
    dislikesCount = 0,
    myStatus: LikeStatus = LikeStatus.None,
    public newestLikes: LikeViewModel[] = [],
  ) {
    super(likesCount, dislikesCount, myStatus);
  }
  public static construct(
    info: LikesInfoModel,
    newestLikes: LikeViewModel[],
  ): ExtendedLikesInfoModel {
    return new ExtendedLikesInfoModel(
      info.likesCount,
      info.dislikesCount,
      info.myStatus,
      newestLikes,
    );
  }
}
