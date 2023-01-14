import { Repository, SelectQueryBuilder } from 'typeorm';
import PageViewModel from '../../../common/models/page.view.model';
import { QuestionQueryRepository } from '../interfaces/question.query.repository';
import { GetQuestionsQuery } from '../models/input/get.questions.query';
import { QuestionViewModel } from '../models/view/question.view.model';
import { Question } from './models/question';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionMapper } from './models/question.mapper';

export class OrmQuestionQueryRepository extends QuestionQueryRepository {
  constructor(
    @InjectRepository(Question)
    private readonly repo: Repository<Question>,
  ) {
    super();
  }

  public async getQuestions(
    params: GetQuestionsQuery,
  ): Promise<PageViewModel<QuestionViewModel>> {
    try {
      const page = await this.loadQuestions(params);
      return page;
    } catch (error) {
      console.error(error);
      return new PageViewModel(params.pageNumber, params.pageSize, 0);
    }
  }
  public async getQuestion(id: string): Promise<QuestionViewModel> {
    try {
      const result = await this.repo.findOneBy({ id });
      return result ? QuestionMapper.toView(result) : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  private async loadQuestions(
    params: GetQuestionsQuery,
  ): Promise<PageViewModel<QuestionViewModel>> {
    const page = new PageViewModel<QuestionViewModel>(
      params.pageNumber,
      params.pageSize,
      0,
    );
    const builder = this.getQueryBuilder(params);
    const [result, count] = await builder
      .orderBy(`"${params.sortBy}"`, params.sortOrder)
      .offset(page.calculateSkip())
      .limit(page.pageSize)
      .getManyAndCount();

    page.setTotalCount(count);
    const views = result.map((q) => QuestionMapper.toView(q));
    return page.add(...views);
  }
  private getQueryBuilder(
    params: GetQuestionsQuery,
  ): SelectQueryBuilder<Question> {
    const builder = this.repo.createQueryBuilder('q');
    if (params.bodySearchTerm) {
      builder.where(`q."body" ilike :term`, {
        term: `%${params.bodySearchTerm}%`,
      });
    }
    return builder;
  }
}
