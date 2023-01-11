import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionRepository } from '../../interfaces/question.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DeleteQuestionCommand } from '../commands/delete.question.command';

@CommandHandler(DeleteQuestionCommand)
export class DeleteQuestionHandler
  implements ICommandHandler<DeleteQuestionCommand>
{
  constructor(private readonly repo: QuestionRepository) { }

  async execute(command: DeleteQuestionCommand): Promise<void> {
    const question = await this.repo.get(command.id);
    if (!question) throw new NotFoundException('Question does not exist');

    const deleted = await this.repo.delete(question.id);
    if (!deleted) throw new BadRequestException('Question was not deletd');
    return;
  }
}
