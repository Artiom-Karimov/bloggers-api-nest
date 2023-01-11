import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionRepository } from '../../interfaces/question.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateQuestionCommand } from '../commands/update.question.command';

@CommandHandler(UpdateQuestionCommand)
export class UpdateQuestionHandler
  implements ICommandHandler<UpdateQuestionCommand>
{
  constructor(private readonly repo: QuestionRepository) { }

  async execute(command: UpdateQuestionCommand): Promise<void> {
    const question = await this.repo.get(command.id);
    if (!question) throw new NotFoundException('Question does not exist');

    question.update(command.data);
    const updated = await this.repo.update(question);
    if (!updated) throw new BadRequestException('Question was not updated');
    return;
  }
}
