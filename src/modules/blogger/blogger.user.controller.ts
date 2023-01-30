import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import PageViewModel from '../../common/models/page.view.model';
import { BearerAuthGuard } from '../auth/guards/bearer.auth.guard';
import { User } from '../auth/guards/user.decorator';
import TokenPayload from '../auth/models/jwt/token.payload';
import AdminBlogsQueryRepository from '../blogs/blogs/interfaces/admin.blogs.query.repository';
import BlogUserBanQueryRepository from '../blogs/blogs/interfaces/blog.user.ban.query.repository';
import BlogUserBanCommand from '../blogs/blogs/usecases/commands/blog.user.ban.command';
import BlogUserBanInputModel from '../blogs/blogs/models/input/blog.user.ban.input.model';
import GetBlogUserBansQuery from '../blogs/blogs/models/input/get.blog.user.bans.query';
import BlogUserBanViewModel from '../blogs/blogs/models/view/blog.user.ban.view.model';
import IdParams from '../../common/models/id.param';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger/dist/decorators';
import { BloggerUserBanPage } from '../swagger/models/pages';

@Controller('blogger/users')
@UseGuards(BearerAuthGuard)
@ApiTags('Users (for blogger)')
@ApiBearerAuth()
export default class BloggerUserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly banRepo: BlogUserBanQueryRepository,
    private readonly blogRepo: AdminBlogsQueryRepository,
  ) { }

  @Put(':userId/ban')
  @HttpCode(204)
  @ApiOperation({ summary: 'Ban/unban user for specified blog' })
  @ApiParam({ name: 'userId' })
  @ApiResponse({ status: 204, description: 'Success' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Blog is not owned by this blogger',
  })
  @ApiResponse({ status: 404, description: 'User or blog not found' })
  public async putBan(
    @Param() params: IdParams,
    @Body() data: BlogUserBanInputModel,
    @User() blogger: TokenPayload,
  ): Promise<void> {
    return this.commandBus.execute(
      new BlogUserBanCommand({
        ...data,
        userId: params.userId,
        bloggerId: blogger.userId,
      }),
    );
  }

  @Get('blog/:blogId')
  @ApiOperation({ summary: 'Get banned users for specified blog' })
  @ApiParam({ name: 'blogId' })
  @ApiQuery({ type: GetBlogUserBansQuery })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: BloggerUserBanPage,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Blog is not owned by this blogger',
  })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  public async getBannedUsers(
    @Param() params: IdParams,
    @User() blogger: TokenPayload,
    @Query() reqQuery: any,
  ): Promise<PageViewModel<BlogUserBanViewModel>> {
    const blog = await this.blogRepo.getAdminBlog(params.blogId);
    if (!blog) throw new NotFoundException();
    if (blog.blogOwnerInfo?.userId !== blogger.userId)
      throw new ForbiddenException();

    const query = new GetBlogUserBansQuery(reqQuery, params.blogId);
    return this.banRepo.getUsers(query);
  }
}
