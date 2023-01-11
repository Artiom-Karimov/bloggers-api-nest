import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateQuestionCommand } from '../commands/create.question.command';
import { QuestionRepository } from '../../interfaces/question.repository';
import { QuestionQueryRepository } from '../../interfaces/question.query.repository';
import { QuestionViewModel } from '../../models/question.view.model';
import { Question } from '../../typeorm/models/question';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(CreateQuestionCommand)
export class CreateQuestionHandler
  implements ICommandHandler<CreateQuestionCommand>
{
  constructor(
    private readonly repo: QuestionRepository,
    private readonly queryRepo: QuestionQueryRepository,
  ) { }

  async execute(command: CreateQuestionCommand): Promise<QuestionViewModel> {
    const question = Question.create(command.data);
    const created = await this.repo.create(question);
    if (!created) throw new BadRequestException('Question was not created');

    const retrieved = await this.queryRepo.getQuestion(question.id);
    if (!retrieved) throw new BadRequestException('Question was not created');
    return retrieved;
  }
}
