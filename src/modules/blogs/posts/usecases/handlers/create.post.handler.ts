import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogsRepository from '../../../blogs/interfaces/blogs.repository';
import PostsRepository from '../../interfaces/posts.repository';
import CreatePostCommand from '../commands/create.post.command';
import { Post } from '../../typeorm/models/post';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    private readonly blogsRepo: BlogsRepository,
    private readonly postsRepo: PostsRepository,
  ) { }

  async execute(command: CreatePostCommand): Promise<string> {
    const { blogId, bloggerId } = command.data;
    const blog = await this.blogsRepo.get(blogId);
    if (!blog) throw new NotFoundException('blog not found');

    if (blog.ownerId !== bloggerId || blog.isBanned)
      throw new ForbiddenException('operation not allowed');

    const post = Post.create(command.data, blog);
    const created = await this.postsRepo.create(post);

    if (!created) throw new BadRequestException('cannot create post');
    return created;
  }
}
