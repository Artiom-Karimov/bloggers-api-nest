import LikeCreateModel from '../../../likes/models/like.create.model';

export default class PutCommentLikeCommand {
  constructor(public data: LikeCreateModel) { }
}
