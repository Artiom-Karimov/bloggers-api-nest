import { Repository } from 'typeorm';
import { QuestionRepository } from '../interfaces/question.repository';
import { Question } from '../models/domain/question';
import { InjectRepository } from '@nestjs/typeorm';

export class OrmQuestionRepository extends QuestionRepository {
  constructor(
    @InjectRepository(Question)
    private readonly repo: Repository<Question>,
  ) {
    super();
  }

  public async get(id: string): Promise<Question | undefined> {
    try {
      const question = await this.repo.findOne({ where: { id } });
      return question ?? undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async create(question: Question): Promise<string> {
    try {
      const result = await this.repo.save(question);
      return result.id;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async update(question: Question): Promise<boolean> {
    return !!(await this.create(question));
  }

  public async delete(id: string): Promise<boolean> {
    try {
      const result = await this.repo.delete({ id });
      return !!result.affected;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  public async getRandom(amount: number): Promise<Question[]> {
    try {
      const result = await this.repo
        .createQueryBuilder('q')
        .orderBy('random()')
        .limit(amount)
        .getMany();

      return result;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
