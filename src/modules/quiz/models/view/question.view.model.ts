import { ApiProperty } from '@nestjs/swagger';

export class QuestionViewModel {
  @ApiProperty()
  public id: string;
  @ApiProperty()
  public body: string;
  @ApiProperty()
  public correctAnswers: string[];
  @ApiProperty()
  public published: boolean;
  @ApiProperty()
  public createdAt: string;
  @ApiProperty({ nullable: true })
  public updatedAt: string | null;

  constructor(
    id: string,
    body: string,
    correctAnswers: string[],
    published: boolean,
    createdAt: string,
    updatedAt: string | null,
  ) {
    this.id = id;
    this.body = body;
    this.correctAnswers = correctAnswers;
    this.published = published;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
