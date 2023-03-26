import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuizRepository } from '../../interfaces/quiz.repository';
import {
  ForbiddenException,
  HttpException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { SendQuizAnswerCommand } from '../commands/send.quiz.answer.command';
import { QueryRunner } from 'typeorm';
import { AnswerInfo } from '../../models/view/player.progress';
import { QuizStatus } from '../../models/domain/quiz.status';
import { Quiz } from '../../models/domain/quiz';

@CommandHandler(SendQuizAnswerCommand)
export class SendQuizAnswerHandler
  implements ICommandHandler<SendQuizAnswerCommand>
{
  constructor(private readonly repo: QuizRepository) { }

  async execute(command: SendQuizAnswerCommand): Promise<AnswerInfo> {
    const quizId = await this.repo.getCurrentGameId(command.userId);
    if (!quizId)
      throw new ForbiddenException("user doesn't have an active game");

    const result = await this.commitAnswer(
      quizId,
      command.userId,
      command.data.answer,
    );

    return result;
  }

  protected async commitAnswer(
    quizId: string,
    userId: string,
    answer: string,
  ): Promise<AnswerInfo> {
    let qr: QueryRunner;
    try {
      qr = await this.repo.startTransaction();
      const game = await this.repo.getCurrentGame(quizId, qr);
      if (!game) throw new NotFoundException('game not found');

      const result = game.acceptAnswer(userId, answer);
      if (!result) throw new ForbiddenException('answer was not accepted');

      await this.repo.save(game, qr);
      await this.updateStatsIfEnded(game);

      await qr.commitTransaction();
      await qr.release();

      return result;
    } catch (error) {
      console.error(error);
      if (qr) await qr.rollbackTransaction();
      if (qr) await qr.release();
      throw error;
    }
  }

  protected async updateStatsIfEnded(game: Quiz): Promise<void> {
    if (game?.status !== QuizStatus.Finished) return;
    // TODO: create or update stats for all players
  }
}
