export type FieldError = {
  message: string;
  field: string;
};

export default class APIErrorResult {
  public readonly errorsMessages: FieldError[] = [];
  public push = (err: FieldError) => {
    this.errorsMessages.push(err);
  };
}
