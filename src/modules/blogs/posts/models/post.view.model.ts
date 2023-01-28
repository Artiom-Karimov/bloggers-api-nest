import { ApiProperty } from '@nestjs/swagger';
import { ExtendedLikesInfoModel } from '../../likes/models/likes.info.model';

export default class PostViewModel {
  @ApiProperty()
  public id: string;
  @ApiProperty()
  public title: string;
  @ApiProperty()
  public shortDescription: string;
  @ApiProperty()
  public content: string;
  @ApiProperty()
  public blogId: string;
  @ApiProperty()
  public blogName: string;
  @ApiProperty()
  public createdAt: string;
  @ApiProperty()
  public extendedLikesInfo: ExtendedLikesInfoModel;

  constructor(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: ExtendedLikesInfoModel = new ExtendedLikesInfoModel(),
  ) {
    this.id = id;
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
    this.blogName = blogName;
    this.createdAt = createdAt;
    this.extendedLikesInfo = extendedLikesInfo;
  }
}
