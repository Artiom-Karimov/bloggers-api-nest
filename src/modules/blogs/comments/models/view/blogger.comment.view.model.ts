import { LikesInfoModel } from '../../../likes/models/likes.info.model';
import CommentViewModel from './comment.view.model';

export type CommentatorInfo = {
  userId: string;
  userLogin: string;
};
export type PostInfo = {
  id: string;
  title: string;
  blogId: string;
  blogName: string;
};

export default class BloggerCommentViewModel {
  public id: string;
  public content: string;
  public createdAt: string;
  public likesInfo: LikesInfoModel;
  public commentatorInfo: CommentatorInfo;

  constructor(viewModel: CommentViewModel, public postInfo: PostInfo) {
    this.id = viewModel.id;
    this.content = viewModel.content;
    this.createdAt = viewModel.createdAt;
    this.likesInfo = viewModel.likesInfo;
    this.commentatorInfo = {
      userId: viewModel.userId,
      userLogin: viewModel.userLogin,
    };
  }
}
