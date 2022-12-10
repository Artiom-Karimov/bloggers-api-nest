import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogsRepository from '../../../blogs/blogs.repository';
import { BlogError } from '../../../blogs/models/blog.error';
import PostsRepository from '../../posts.repository';
import UpdatePostCommand from '../commands/update.post.command';

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private readonly blogsRepo: BlogsRepository,
    private readonly postsRepo: PostsRepository,
  ) { }

  async execute(command: UpdatePostCommand): Promise<BlogError> {
    const { blogId, bloggerId, postId, data } = command.data;
    const blog = await this.blogsRepo.get(blogId);
    if (!blog) return BlogError.NotFound;
    if (blog.ownerId !== bloggerId) return BlogError.Forbidden;

    const post = await this.postsRepo.get(postId);
    if (!post) return BlogError.NotFound;
    if (post.blogId !== blogId) return BlogError.NotFound;

    const updated = await this.postsRepo.update(postId, data);
    return updated ? BlogError.NoError : BlogError.Unknown;
  }
}
