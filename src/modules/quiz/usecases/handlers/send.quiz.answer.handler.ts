import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AnswerInfo } from '../../models/view/quiz.view.model';
import { QuizRepository } from '../../interfaces/quiz.repository';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { SendQuizAnswerCommand } from '../commands/send.quiz.answer.command';
import { QueryRunner } from 'typeorm';

@CommandHandler(SendQuizAnswerCommand)
export class SendQuizAnswerHandler
  implements ICommandHandler<SendQuizAnswerCommand>
{
  constructor(private readonly repo: QuizRepository) { }

  async execute(command: SendQuizAnswerCommand): Promise<AnswerInfo> {
    const quizId = await this.repo.getCurrentGameId(command.userId);
    if (!quizId)
      throw new ForbiddenException("user doesn't have an active game");

    try {
      const result = await this.commitAnswer(
        quizId,
        command.userId,
        command.data.answer,
      );
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error(error);
      throw new BadRequestException('something went wrong');
    }
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
      await this.repo.save(game, qr);
      await qr.commitTransaction();

      return result;
    } catch (error) {
      if (qr) await qr.rollbackTransaction();
    } finally {
      if (qr) await qr.release();
    }
  }
}
