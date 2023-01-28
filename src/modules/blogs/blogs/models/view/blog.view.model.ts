import { ApiProperty } from '@nestjs/swagger';

export default class BlogViewModel {
  @ApiProperty()
  public id: string;
  @ApiProperty()
  public name: string;
  @ApiProperty()
  public description: string;
  @ApiProperty()
  public websiteUrl: string;
  @ApiProperty()
  public createdAt: string;

  constructor(
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.createdAt = createdAt;
  }
}
