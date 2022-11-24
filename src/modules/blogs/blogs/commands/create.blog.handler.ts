import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogsRepository from '../blogs.repository';
import BlogModel from '../models/blog.model';
import CreateBlogCommand from './create.blog.command';

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(private readonly repo: BlogsRepository) { }

  async execute(command: CreateBlogCommand): Promise<string> {
    const newBlog = BlogModel.create(command.data, command.owner);
    return this.repo.create(newBlog);
  }
}
