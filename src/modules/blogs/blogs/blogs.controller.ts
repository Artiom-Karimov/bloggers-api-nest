import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import BlogsQueryRepository from './interfaces/blogs.query.repository';
import PostsQueryRepository from '../posts/interfaces/posts.query.repository';
import PageViewModel from '../../../common/models/page.view.model';
import BlogViewModel from './models/view/blog.view.model';
import GetBlogsQuery from './models/input/get.blogs.query';
import { OptionalBearerAuthGuard } from '../../auth/guards/optional.bearer.auth.guard';
import PostViewModel from '../posts/models/post.view.model';
import GetPostsQuery from '../posts/models/get.posts.query';
import TokenPayload from '../../auth/models/jwt/token.payload';
import { User } from '../../auth/guards/user.decorator';
import IdParams from '../../../common/models/id.param';
import { ApiTags } from '@nestjs/swagger/dist';

@Controller('blogs')
@ApiTags('Blogs')
export default class BlogsController {
  constructor(
    private readonly queryRepo: BlogsQueryRepository,
    private readonly postsQueryRepo: PostsQueryRepository,
  ) { }

  @Get()
  async get(@Query() reqQuery: any): Promise<PageViewModel<BlogViewModel>> {
    const query = new GetBlogsQuery(reqQuery);
    return this.queryRepo.getBlogs(query);
  }
  @Get(':id')
  async getOne(@Param() params: IdParams): Promise<BlogViewModel> {
    const blog = await this.queryRepo.getBlog(params.id);
    if (blog) return blog;
    throw new NotFoundException();
  }

  @Get(':id/posts')
  @UseGuards(OptionalBearerAuthGuard)
  async getPosts(
    @Query() reqQuery: any,
    @Param() params: IdParams,
    @User() user: TokenPayload,
  ): Promise<PageViewModel<PostViewModel>> {
    const blog = await this.queryRepo.getBlog(params.id);
    if (!blog) throw new NotFoundException();
    const userId = user ? user.userId : undefined;
    const query = new GetPostsQuery(reqQuery, params.id, userId);
    return this.postsQueryRepo.getPosts(query);
  }
}
