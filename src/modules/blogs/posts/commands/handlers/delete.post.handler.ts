import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import AdminBlogsQueryRepository from '../../../blogs/admin.blogs.query.repository';
import { BlogError } from '../../../blogs/models/blog.error';
import PostsRepository from '../../posts.repository';
import DeletePostCommand from '../commands/delete.post.command';

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(
    private readonly blogsQueryRepo: AdminBlogsQueryRepository,
    private readonly postsRepo: PostsRepository,
  ) { }

  async execute(command: DeletePostCommand): Promise<BlogError> {
    const { blogId, postId, bloggerId } = command.data;
    const blog = await this.blogsQueryRepo.getAdminBlog(blogId);
    if (!blog) return BlogError.NotFound;
    if (blog.blogOwnerInfo.userId !== bloggerId) return BlogError.Forbidden;

    const post = await this.postsRepo.get(postId);
    if (!post) return BlogError.NotFound;
    if (post.blogId !== blogId) return BlogError.NotFound;

    const deleted = await this.postsRepo.delete(postId);
    return deleted ? BlogError.NoError : BlogError.Unknown;
  }
}
