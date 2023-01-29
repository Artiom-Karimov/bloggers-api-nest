import { Matches } from 'class-validator';
import { regex } from '../../../../common/utils/validation.regex';
import { ApiProperty } from '@nestjs/swagger';

export default class CodeInputModel {
  @Matches(regex.uuid)
  @ApiProperty()
  code: string;
}
