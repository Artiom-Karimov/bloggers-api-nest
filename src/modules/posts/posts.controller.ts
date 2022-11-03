import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import PageViewModel from 'src/common/models/page.view.model';
import BlogsQueryRepository from '../blogs/blogs.query.repository';
import GetPostsQuery from './models/get.posts.query';
import { PostInputModel } from './models/post.model';
import PostViewModel from './models/post.view.model';
import PostsQueryRepository from './posts.query.repository';
import PostsService from './posts.service';

@Controller('posts')
export default class PostsController {
  constructor(
    private readonly service: PostsService,
    private readonly queryRepo: PostsQueryRepository,
  ) { }

  @Get()
  async get(@Query() reqQuery: any): Promise<PageViewModel<PostViewModel>> {
    const query = new GetPostsQuery(reqQuery, undefined, undefined);
    return this.queryRepo.getPosts(query);
  }
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<PostViewModel> {
    const result = this.queryRepo.getPost(id);
    if (!result) throw new NotFoundException();
    return result;
  }
  @Post()
  @HttpCode(201)
  async create(@Body() data: PostInputModel): Promise<PostViewModel> {
    const blog = await this.queryRepo.getBlog(data.blogId);
    if (!blog) throw new BadRequestException();

    const created = await this.service.create(data);
    if (!created) throw new BadRequestException();

    const retrieved = await this.queryRepo.getPost(created);
    if (!retrieved) throw new BadRequestException();

    return retrieved;
  }
  @Put(':id')
  @HttpCode(204)
  async update(
    @Param('id') id: string,
    @Body() data: PostInputModel,
  ): Promise<void> {
    const updated = await this.service.update(id, data);
    if (!updated) throw new NotFoundException();
    return;
  }
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    const deleted = await this.service.delete(id);
    if (!deleted) throw new NotFoundException();
    return;
  }
}
