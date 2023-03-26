import { InjectRepository } from '@nestjs/typeorm';
import { QuizStatsRepository } from '../interfaces/quiz.stats.repository';
import { QuizStats } from '../models/domain/quiz.stats';
import { In, Repository } from 'typeorm';

export class OrmQuizStatsRepository extends QuizStatsRepository {
  constructor(
    @InjectRepository(QuizStats) private readonly repo: Repository<QuizStats>,
  ) {
    super();
  }

  public async get(userId: string): Promise<QuizStats> {
    try {
      const stats = await this.repo.findOne({
        relations: { user: true },
        where: { userId },
      });
      return stats ?? undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async getMany(userIds: string[]): Promise<QuizStats[]> {
    try {
      const result = await this.repo.find({
        relations: { user: true },
        where: { userId: In(userIds) },
      });
      return result;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async create(stats: QuizStats): Promise<string> {
    try {
      const result = await this.repo.save(stats);
      return result.userId;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async update(stats: QuizStats): Promise<boolean> {
    return !!(await this.create(stats));
  }
}
