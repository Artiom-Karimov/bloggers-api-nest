import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class QuestionPublishModel {
  @IsBoolean()
  @ApiProperty()
  published: boolean;
}
