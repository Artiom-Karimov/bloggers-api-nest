import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import AdminBlogsQueryRepository from '../../blogs/admin.blogs.query.repository';
import { PostError } from '../models/post.error';
import PostModel from '../models/post.model';
import PostsRepository from '../posts.repository';
import CreatePostCommand from './create.post.command';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    private readonly blogsQueryRepo: AdminBlogsQueryRepository,
    private readonly postsRepo: PostsRepository,
  ) { }

  async execute(command: CreatePostCommand): Promise<string | PostError> {
    const { blogId, bloggerId } = command.data;
    const blog = await this.blogsQueryRepo.getAdminBlog(blogId);
    if (!blog) return PostError.NotFound;
    if (blog.blogOwnerInfo.userId !== bloggerId || blog.banInfo.isBanned)
      return PostError.Forbidden;

    command.data.blogName = blog.name;
    const post = PostModel.create(command.data);
    const created = await this.postsRepo.create(post);
    return created ? created : PostError.Unknown;
  }
}
