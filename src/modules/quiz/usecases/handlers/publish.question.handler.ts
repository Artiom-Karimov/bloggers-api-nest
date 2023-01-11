import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionRepository } from '../../interfaces/question.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PublishQuestionCommand } from '../commands/publish.question.command';

@CommandHandler(PublishQuestionCommand)
export class PublishQuestionHandler
  implements ICommandHandler<PublishQuestionCommand>
{
  constructor(private readonly repo: QuestionRepository) { }

  async execute(command: PublishQuestionCommand): Promise<void> {
    const question = await this.repo.get(command.id);
    if (!question) throw new NotFoundException('Question does not exist');

    question.setPublished(command.data.published);
    const updated = await this.repo.update(question);
    if (!updated) throw new BadRequestException('Question was not updated');
    return;
  }
}
