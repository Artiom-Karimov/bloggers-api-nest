import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogsQueryRepository from '../../blogs/blogs.query.repository';
import { PostError } from '../models/post.error';
import PostsRepository from '../posts.repository';
import DeletePostCommand from './delete.post.command';

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(
    private readonly blogsQueryRepo: BlogsQueryRepository,
    private readonly postsRepo: PostsRepository,
  ) { }

  async execute(command: DeletePostCommand): Promise<PostError> {
    const { blogId, postId, bloggerId } = command.data;
    const blog = await this.blogsQueryRepo.getAdminBlog(blogId);
    if (!blog) return PostError.NotFound;
    if (blog.blogOwnerInfo.userId !== bloggerId) return PostError.Forbidden;

    const post = await this.postsRepo.get(postId);
    if (!post) return PostError.NotFound;
    if (post.blogId !== blogId) return PostError.NotFound;

    const deleted = await this.postsRepo.delete(postId);
    return deleted ? PostError.NoError : PostError.Unknown;
  }
}
