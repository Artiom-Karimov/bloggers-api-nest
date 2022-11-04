export type LikeStatus = 'None' | 'Like' | 'Dislike';

export class LikesInfoModel {
  constructor(
    public likesCount = 0,
    public dislikesCount = 0,
    public myStatus: LikeStatus = 'None',
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
    myStatus: LikeStatus = 'None',
    public newestLikes: LikeViewModel[] = [],
  ) {
    super(likesCount, dislikesCount, myStatus);
  }
}
