import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SaveQuizStatsCommand } from '../commands/save.quiz.stats.command';
import { QuizStatsRepository } from '../../interfaces/quiz.stats.repository';
import { QuizStats } from '../../models/domain/quiz.stats';
import UsersRepository from '../../../users/interfaces/users.repository';
import { User } from '../../../users/typeorm/models/user';

@CommandHandler(SaveQuizStatsCommand)
export class SaveQuizStatsHandler
  implements ICommandHandler<SaveQuizStatsCommand>
{
  constructor(
    private readonly repo: QuizStatsRepository,
    private readonly usersRepo: UsersRepository,
  ) { }

  async execute(command: SaveQuizStatsCommand): Promise<boolean> {
    const quiz = command.quiz;
    const stats = QuizStats.fromQuiz(quiz);
    if (!stats) return false;

    const ids = stats.map((s) => s.userId);
    let oldStats = await this.repo.getMany(ids);
    if (!oldStats) oldStats = [];

    const newStats = QuizStats.mergeManyWithExisting(oldStats, stats);
    await this.loadUsersIfNeeded(newStats);
    return this.repo.createOrUpdateMany(newStats);
  }

  private async loadUsersIfNeeded(stats: QuizStats[]): Promise<void> {
    const promises: Promise<User>[] = [];

    for (const s of stats) {
      if (!s.user) promises.push(this.usersRepo.get(s.userId));
    }

    if (promises.length === 0) return;
    const users = await Promise.all(promises);

    for (const user of users) {
      const stat = stats.find((s) => s.userId === user.id);
      stat.user = user;
    }
  }
}
