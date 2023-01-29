import {
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
  UseGuards,
} from '@nestjs/common';
import PageViewModel from '../../common/models/page.view.model';
import { BasicAuthGuard } from '../auth/guards/basic.auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import IdParams from '../../common/models/id.param';
import { QuestionQueryRepository } from '../quiz/interfaces/question.query.repository';
import { QuestionViewModel } from '../quiz/models/view/question.view.model';
import { GetQuestionsQuery } from '../quiz/models/input/get.questions.query';
import { QuestionInputModel } from '../quiz/models/input/question.input.model';
import { CreateQuestionCommand } from '../quiz/usecases/commands/create.question.command';
import { DeleteQuestionCommand } from '../quiz/usecases/commands/delete.question.command';
import { UpdateQuestionCommand } from '../quiz/usecases/commands/update.question.command';
import { QuestionPublishModel } from '../quiz/models/input/question.publish.model';
import { PublishQuestionCommand } from '../quiz/usecases/commands/publish.question.command';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

@Controller('sa/quiz/questions')
@UseGuards(BasicAuthGuard)
@ApiTags('Quiz (for admin)')
@ApiBasicAuth()
export default class AdminQuizController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly questionQueryRepo: QuestionQueryRepository,
  ) { }

  @Get('')
  async get(@Query() reqQuery: any): Promise<PageViewModel<QuestionViewModel>> {
    const query = new GetQuestionsQuery(reqQuery);
    return this.questionQueryRepo.getQuestions(query);
  }
  @Get(':id')
  async getOne(@Param() params: IdParams): Promise<QuestionViewModel> {
    const result = await this.questionQueryRepo.getQuestion(params.id);
    if (!result) throw new NotFoundException();
    return result;
  }
  @Post('')
  @HttpCode(201)
  async create(@Body() data: QuestionInputModel): Promise<QuestionViewModel> {
    return this.commandBus.execute(new CreateQuestionCommand(data));
  }
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param() params: IdParams): Promise<void> {
    return this.commandBus.execute(new DeleteQuestionCommand(params.id));
  }
  @Put(':id')
  @HttpCode(204)
  async update(
    @Param() params: IdParams,
    @Body() data: QuestionInputModel,
  ): Promise<void> {
    return this.commandBus.execute(new UpdateQuestionCommand(params.id, data));
  }
  @Put(':id/publish')
  @HttpCode(204)
  async publish(
    @Param() params: IdParams,
    @Body() data: QuestionPublishModel,
  ): Promise<void> {
    return this.commandBus.execute(new PublishQuestionCommand(params.id, data));
  }
}
