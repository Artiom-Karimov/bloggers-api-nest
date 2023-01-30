import { ApiProperty } from '@nestjs/swagger';
import { LikesInfoModel } from '../../../likes/models/likes.info.model';
import CommentViewModel from './comment.view.model';

export class CommentatorInfo {
  @ApiProperty()
  userId: string;
  @ApiProperty()
  userLogin: string;
}
export class PostInfo {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  blogId: string;
  @ApiProperty()
  blogName: string;
}

export default class BloggerCommentViewModel {
  @ApiProperty()
  public id: string;
  @ApiProperty()
  public content: string;
  @ApiProperty()
  public createdAt: string;
  @ApiProperty()
  public likesInfo: LikesInfoModel;
  @ApiProperty()
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
