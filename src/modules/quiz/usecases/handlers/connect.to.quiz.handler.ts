import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { ConnectToQuizCommand } from '../commands/connect.to.quiz.command';
import { QuizViewModel } from '../../models/view/quiz.view.model';
import { QuizRepository } from '../../interfaces/quiz.repository';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { Quiz } from '../../typeorm/models/quiz';
import UsersRepository from '../../../users/interfaces/users.repository';
import { QuestionRepository } from '../../interfaces/question.repository';
import { GetCurrentGameQuery } from '../queries/get.current.game.query';
import { User } from '../../../users/typeorm/models/user';

@CommandHandler(ConnectToQuizCommand)
export class ConnectToQuizHandler
  implements ICommandHandler<ConnectToQuizCommand>
{
  constructor(
    private readonly repo: QuizRepository,
    private readonly questionRepo: QuestionRepository,
    private readonly userRepo: UsersRepository,
    private readonly queryBus: QueryBus,
  ) { }

  async execute(command: ConnectToQuizCommand): Promise<QuizViewModel> {
    const alreadyConnected = await this.repo.hasCurrentGame(command.userId);
    if (alreadyConnected)
      throw new ForbiddenException('user is already connected to a quiz');

    const user = await this.userRepo.get(command.userId);
    if (!user) throw new NotFoundException('user not found');

    try {
      const game = await this.getGameAppendUser(user);
      await this.repo.save(game);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('something went wrong');
    }

    return this.queryBus.execute(new GetCurrentGameQuery(command.userId));
  }

  private async getGameAppendUser(user: User): Promise<Quiz> {
    let game = await this.repo.getPendingGame();
    if (game) {
      game.addParticipant(user);
    } else {
      const questions = await this.questionRepo.getRandom(5);
      game = Quiz.create(user, questions);
    }
    return game;
  }
}
