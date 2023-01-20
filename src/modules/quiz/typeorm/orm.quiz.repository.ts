import { Injectable } from '@nestjs/common';
import { Quiz } from '../models/domain/quiz';
import { QuizRepository } from '../interfaces/quiz.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class OrmQuizRepository extends QuizRepository {
  constructor(
    @InjectRepository(Quiz)
    private readonly repo: Repository<Quiz>,
  ) {
    super();
  }
  public async hasCurrentGame(userId: string): Promise<boolean> {
    const result = await this.repo.exist({
      where: { endedAt: IsNull(), participants: { userId } },
    });
    return result;
  }
  // TODO: add pessimistic lock on get, release on save
  public async getCurrentGame(userId: string): Promise<Quiz> {
    const result = await this.repo.findOne({
      where: { endedAt: null, participants: { userId } },
    });
    return result ? result.sortChildren() : undefined;
  }
  public async getPendingGame(): Promise<Quiz> {
    const result = await this.repo.findOne({
      where: { startedAt: IsNull() },
    });
    return result ? result.sortChildren() : undefined;
  }
  public async save(quiz: Quiz): Promise<boolean> {
    await this.repo.save(quiz);
    return true;
  }
}
