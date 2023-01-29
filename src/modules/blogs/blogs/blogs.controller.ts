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
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist';
import { SwaggerBlogPage, SwaggerPostPage } from '../../swagger/models/pages';

@Controller('blogs')
@ApiTags('Blogs (for user)')
export class BlogsController {
  constructor(
    private readonly queryRepo: BlogsQueryRepository,
    private readonly postsQueryRepo: PostsQueryRepository,
  ) { }

  @Get()
  @ApiOperation({ summary: 'Get blog list with pagination' })
  @ApiQuery({ type: GetBlogsQuery })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SwaggerBlogPage,
  })
  async get(@Query() reqQuery: any): Promise<PageViewModel<BlogViewModel>> {
    const query = new GetBlogsQuery(reqQuery);
    return this.queryRepo.getBlogs(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get blog by id' })
  @ApiParam({ name: 'id' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: BlogViewModel,
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 400, description: 'Illegal values received' })
  async getOne(@Param() params: IdParams): Promise<BlogViewModel> {
    const blog = await this.queryRepo.getBlog(params.id);
    if (blog) return blog;
    throw new NotFoundException();
  }

  @Get(':blogId/posts')
  @UseGuards(OptionalBearerAuthGuard)
  @ApiOperation({ summary: 'Get post list by blog id' })
  @ApiQuery({ type: GetPostsQuery })
  @ApiParam({ name: 'blogId' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SwaggerPostPage,
  })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  @ApiResponse({ status: 400, description: 'Illegal values received' })
  async getPosts(
    @Query() reqQuery: any,
    @Param() params: IdParams,
    @User() user: TokenPayload,
  ): Promise<PageViewModel<PostViewModel>> {
    const blog = await this.queryRepo.getBlog(params.blogId);
    if (!blog) throw new NotFoundException();
    const userId = user ? user.userId : undefined;
    const query = new GetPostsQuery(reqQuery, params.blogId, userId);
    return this.postsQueryRepo.getPosts(query);
  }
}
