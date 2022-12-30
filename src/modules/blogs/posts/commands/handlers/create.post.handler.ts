import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import BlogsRepository from '../../../blogs/interfaces/blogs.repository';
import { BlogError } from '../../../blogs/models/blog.error';
import PostsRepository from '../../interfaces/posts.repository';
import CreatePostCommand from '../commands/create.post.command';
import { Post } from '../../typeorm/models/post';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    private readonly blogsRepo: BlogsRepository,
    private readonly postsRepo: PostsRepository,
  ) { }

  async execute(command: CreatePostCommand): Promise<string | BlogError> {
    const { blogId, bloggerId } = command.data;
    const blog = await this.blogsRepo.get(blogId);
    if (!blog) return BlogError.NotFound;

    if (blog.ownerId !== bloggerId || blog.isBanned) return BlogError.Forbidden;

    const post = Post.create(command.data, blog);
    const created = await this.postsRepo.create(post);
    return created ? created : BlogError.Unknown;
  }
}
