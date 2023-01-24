import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogsRepository from '../../interfaces/blogs.repository';
import AssignBlogOwnerCommand from '../commands/assign.blog.owner.command';
import UsersRepository from '../../../../users/interfaces/users.repository';
import { NotFoundException } from '@nestjs/common';
import {
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common/exceptions';

@CommandHandler(AssignBlogOwnerCommand)
export class AssignBlogOwnerHandler
  implements ICommandHandler<AssignBlogOwnerCommand>
{
  constructor(
    private readonly repo: BlogsRepository,
    private readonly usersRepo: UsersRepository,
  ) { }

  async execute(command: AssignBlogOwnerCommand): Promise<void> {
    const blog = await this.repo.get(command.blogId);
    if (!blog) throw new NotFoundException('blog not found');

    const user = await this.usersRepo.get(command.bloggerId);
    if (!user) throw new NotFoundException('user not found');

    try {
      blog.assignOwner(user);
    } catch (error) {
      throw new ForbiddenException('cannot assign blog owner');
    }

    const result = await this.repo.update(blog);
    if (!result) throw new BadRequestException('something went wrong');
  }
}
