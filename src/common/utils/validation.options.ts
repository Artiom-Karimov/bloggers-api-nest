import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import APIErrorResult from '../models/api.error.result';

const exceptionFactory = (errors: ValidationError[]) => {
  const result = new APIErrorResult(errors);
  throw new BadRequestException(result);
};

export const validationOptions = {
  transform: true,
  exceptionFactory: exceptionFactory,
};

export const throwValidationException = (field: string, message: string) => {
  exceptionFactory([{ property: field, constraints: { message: message } }]);
};
