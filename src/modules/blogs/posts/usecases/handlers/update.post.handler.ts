import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogsRepository from '../../../blogs/interfaces/blogs.repository';
import PostsRepository from '../../interfaces/posts.repository';
import UpdatePostCommand from '../commands/update.post.command';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private readonly blogsRepo: BlogsRepository,
    private readonly postsRepo: PostsRepository,
  ) { }

  async execute(command: UpdatePostCommand): Promise<void> {
    const { blogId, bloggerId, postId } = command.data;
    const blog = await this.blogsRepo.get(blogId);
    if (!blog) throw new NotFoundException('blog not found');
    if (blog.ownerId !== bloggerId)
      throw new ForbiddenException('operation not allowed');

    const post = await this.postsRepo.get(postId);
    if (!post) throw new NotFoundException('post not found');

    try {
      post.updateData(command.data);
    } catch (error) {
      throw new ForbiddenException('operation not allowed');
    }

    const updated = await this.postsRepo.update(post);
    if (!updated) throw new BadRequestException('cannot update post');
  }
}
