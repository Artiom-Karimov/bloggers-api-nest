import { Injectable } from '@nestjs/common';
import { QuizViewModel } from '../models/view/quiz.view.model';
import { QuizQueryRepository } from '../interfaces/quiz.query.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from '../models/domain/quiz';
import { Repository } from 'typeorm';
import { QuizMapper } from './quiz.mapper';

@Injectable()
export class OrmQuizQueryRepository extends QuizQueryRepository {
  constructor(
    @InjectRepository(Quiz)
    private readonly repo: Repository<Quiz>,
  ) {
    super();
  }

  public async getGame(quizId: string): Promise<QuizViewModel> {
    const game = await this.repo.findOne({ where: { id: quizId } });
    return game ? QuizMapper.toView(game) : undefined;
  }
  public async getCurrentGame(userId: string): Promise<QuizViewModel> {
    const game = await this.repo.findOne({
      where: { endedAt: null, participants: { userId } },
    });
    return game ? QuizMapper.toView(game) : undefined;
  }
}
