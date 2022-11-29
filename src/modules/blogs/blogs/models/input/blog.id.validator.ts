import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import PostsQueryRepository from '../../../posts/posts.query.repository';

@ValidatorConstraint({ name: 'blogId', async: true })
@Injectable()
export class BlogIdValidator implements ValidatorConstraintInterface {
  constructor(private readonly repo: PostsQueryRepository) { }
  validate(text: string, args: ValidationArguments) {
    return this.repo.getBlog(text).then((blog) => {
      return !!blog;
    });
  }

  defaultMessage(args: ValidationArguments) {
    return 'Blog does not exist';
  }
}
