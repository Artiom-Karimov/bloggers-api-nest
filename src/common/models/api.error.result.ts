import { ValidationError } from 'class-validator';

export type FieldError = {
  message: string;
  field: string;
};

export default class APIErrorResult {
  public readonly errorsMessages: FieldError[] = [];

  constructor(errors: ValidationError[]) {
    errors.forEach((e) => this.push(e));
  }

  public push(err: ValidationError) {
    const fe = this.convert(err);
    if (!this.errorsMessages.some((m) => m.field === fe.field))
      this.errorsMessages.push(fe);
  }
  private convert(err: ValidationError): FieldError {
    return { field: err.property, message: this.getMessage(err) };
  }
  private getMessage(err: ValidationError): string {
    if (!err.constraints || Object.values(err.constraints).length === 0)
      return '';
    return Object.values(err.constraints)[0];
  }
}
