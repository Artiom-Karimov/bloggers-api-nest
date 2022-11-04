import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import CommentsQueryRepository from './comments.query.repository';
import CommentViewModel from './models/comment.view.model';

@Controller('comments')
export default class CommentsController {
  constructor(private readonly queryRepo: CommentsQueryRepository) { }
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<CommentViewModel> {
    const result = this.queryRepo.getComment(id);
    if (!result) throw new NotFoundException();
    return result;
  }
}
