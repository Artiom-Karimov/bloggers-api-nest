import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AnswerInfo } from '../../models/view/quiz.view.model';
import { QuizRepository } from '../../interfaces/quiz.repository';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { SendQuizAnswerCommand } from '../commands/send.quiz.answer.command';

@CommandHandler(SendQuizAnswerCommand)
export class SendQuizAnswerHandler
  implements ICommandHandler<SendQuizAnswerCommand>
{
  constructor(private readonly repo: QuizRepository) { }

  async execute(command: SendQuizAnswerCommand): Promise<AnswerInfo> {
    const game = await this.repo.getCurrentGame(command.userId);
    if (!game) throw new ForbiddenException("user doesn't have an active game");

    try {
      const result = game.acceptAnswer(command.userId, command.data.answer);
      await this.repo.save(game);
      return result;
    } catch (error) {
      console.error(error);
      throw new ForbiddenException(
        'game is not started or user anwered all questions',
      );
    }
  }
}
