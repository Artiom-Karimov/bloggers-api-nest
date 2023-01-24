import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogsRepository from '../../../blogs/interfaces/blogs.repository';
import PostsRepository from '../../interfaces/posts.repository';
import DeletePostCommand from '../commands/delete.post.command';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(
    private readonly blogsRepo: BlogsRepository,
    private readonly postsRepo: PostsRepository,
  ) { }

  async execute(command: DeletePostCommand): Promise<void> {
    const { blogId, postId, bloggerId } = command.data;
    const blog = await this.blogsRepo.get(blogId);
    if (!blog) throw new NotFoundException('blog not found');
    if (blog.ownerId !== bloggerId)
      throw new ForbiddenException('operation not allowed');

    const post = await this.postsRepo.get(postId);
    if (!post || post.blogId !== blogId)
      throw new NotFoundException('post not found');

    const deleted = await this.postsRepo.delete(postId);
    if (!deleted) throw new BadRequestException('cannot delete post');
  }
}
