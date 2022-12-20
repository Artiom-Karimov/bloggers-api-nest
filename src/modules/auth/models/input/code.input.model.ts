import { Matches } from 'class-validator';
import { regex } from '../../../../common/utils/validation.regex';

export default class CodeInputModel {
  @Matches(regex.uuid)
  code: string;
}
