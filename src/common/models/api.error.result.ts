export type FieldError = {
  message: string;
  field: string;
};

export default class APIErrorResult {
  public readonly errorsMessages: FieldError[] = [];
  public push = (err: FieldError) => {
    if (!this.errorsMessages.some((m) => m.field === err.field))
      this.errorsMessages.push(err);
  };
}
