import { LikeStatus } from './like.input.model';

export default class LikeCreateModel {
  constructor(
    public entityId: string,
    public userId: string,
    public likeStatus: LikeStatus,
  ) { }
}
