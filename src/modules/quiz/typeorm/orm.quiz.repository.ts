import { Injectable } from '@nestjs/common';
import { Quiz } from '../models/domain/quiz';
import { QuizRepository } from '../interfaces/quiz.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
      where: { endedAt: null, participants: { userId } },
    });
    return result;
  }
  // TODO: add pessimistic lock on get, release on save
  public async getCurrentGame(userId: string): Promise<Quiz> {
    const result = await this.repo.findOne({
      where: { endedAt: null, participants: { userId } },
    });
    return result.sortChildren();
  }
  public async getPendingGame(): Promise<Quiz> {
    const result = await this.repo.findOne({
      where: { startedAt: null },
    });
    return result.sortChildren();
  }
  public async save(quiz: Quiz): Promise<boolean> {
    await this.repo.save(quiz);
    return true;
  }
}
