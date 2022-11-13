import { ExtendedLikesInfoModel } from '../likes/likes.info.model';

export default class PostViewModel {
  constructor(
    public id: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public blogName: string,
    public createdAt: string,
    public extendedLikesInfo: ExtendedLikesInfoModel = new ExtendedLikesInfoModel(),
  ) { }
}
