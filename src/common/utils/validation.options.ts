import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import APIErrorResult, { FieldError } from '../models/api.error.result';

const getMessage = (err: ValidationError): string => {
  if (!err.constraints) return '';
  return Object.values(err.constraints)[0];
};

const getFieldError = (err: ValidationError): FieldError => {
  return { field: err.property, message: getMessage(err) };
};

export const validationOptions = {
  stopAtFirstError: true,
  exceptionFactory: (errors: ValidationError[]) => {
    const result = new APIErrorResult();
    errors.forEach((e) => result.push(getFieldError(e)));
    throw new BadRequestException(result);
  },
};
