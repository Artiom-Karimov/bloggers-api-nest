import LikeCreateModel from '../../../likes/models/like.create.model';

export default class PutPostLikeCommand {
  constructor(public data: LikeCreateModel) { }
}
