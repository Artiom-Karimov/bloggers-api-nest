import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import AdminBlogsQueryRepository from '../../../blogs/admin.blogs.query.repository';
import { PostError } from '../../models/post.error';
import PostsRepository from '../../posts.repository';
import UpdatePostCommand from '../commands/update.post.command';

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private readonly blogsQueryRepo: AdminBlogsQueryRepository,
    private readonly postsRepo: PostsRepository,
  ) { }

  async execute(command: UpdatePostCommand): Promise<PostError> {
    const { blogId, bloggerId, postId, data } = command.data;
    const blog = await this.blogsQueryRepo.getAdminBlog(blogId);
    if (!blog) return PostError.NotFound;
    if (blog.blogOwnerInfo.userId !== bloggerId) return PostError.Forbidden;

    const post = await this.postsRepo.get(postId);
    if (!post) return PostError.NotFound;
    if (post.blogId !== blogId) return PostError.NotFound;

    const updated = await this.postsRepo.update(postId, data);
    return updated ? PostError.NoError : PostError.Unknown;
  }
}
