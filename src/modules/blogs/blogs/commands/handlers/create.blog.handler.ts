import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogsRepository from '../../interfaces/blogs.repository';
import CreateBlogCommand from '../commands/create.blog.command';
import { Blog } from '../../typeorm/models/blog';
import UsersRepository from '../../../../users/interfaces/users.repository';

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(
    private readonly blogsRepo: BlogsRepository,
    private readonly usersRepo: UsersRepository,
  ) { }

  async execute(command: CreateBlogCommand): Promise<string> {
    const user = await this.usersRepo.get(command.ownerId);
    if (!user) throw new Error('User not found');
    const newBlog = Blog.create(command.data, user);
    return this.blogsRepo.create(newBlog);
  }
}
