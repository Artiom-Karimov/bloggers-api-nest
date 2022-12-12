import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogsRepository from '../../../blogs/interfaces/blogs.repository';
import { BlogError } from '../../../blogs/models/blog.error';
import PostsRepository from '../../interfaces/posts.repository';
import DeletePostCommand from '../commands/delete.post.command';

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(
    private readonly blogsRepo: BlogsRepository,
    private readonly postsRepo: PostsRepository,
  ) { }

  async execute(command: DeletePostCommand): Promise<BlogError> {
    const { blogId, postId, bloggerId } = command.data;
    const blog = await this.blogsRepo.get(blogId);
    if (!blog) return BlogError.NotFound;
    if (blog.ownerId !== bloggerId) return BlogError.Forbidden;

    const post = await this.postsRepo.get(postId);
    if (!post) return BlogError.NotFound;
    if (post.blogId !== blogId) return BlogError.NotFound;

    const deleted = await this.postsRepo.delete(postId);
    return deleted ? BlogError.NoError : BlogError.Unknown;
  }
}
