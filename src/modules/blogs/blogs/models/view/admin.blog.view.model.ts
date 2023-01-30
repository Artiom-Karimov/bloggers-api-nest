import { ApiProperty } from '@nestjs/swagger';
import BlogViewModel from './blog.view.model';

export class BlogBanInfo {
  @ApiProperty()
  isBanned: boolean;
  @ApiProperty({ nullable: true })
  banDate: string | null;
}
export class BlogOwnerInfo {
  @ApiProperty({ nullable: true })
  userId: string | null;
  @ApiProperty({ nullable: true })
  userLogin: string | null;
}

export default class AdminBlogViewModel extends BlogViewModel {
  @ApiProperty()
  public blogOwnerInfo: BlogOwnerInfo;
  @ApiProperty()
  public banInfo: BlogBanInfo;

  constructor(
    viewModel: BlogViewModel,
    blogOwnerInfo: BlogOwnerInfo,
    banInfo: BlogBanInfo,
  ) {
    super(
      viewModel.id,
      viewModel.name,
      viewModel.description,
      viewModel.websiteUrl,
      viewModel.createdAt,
    );
    this.blogOwnerInfo = blogOwnerInfo;
    this.banInfo = banInfo;
  }
}
