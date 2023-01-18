import { Question } from '../typeorm/models/question';

export abstract class QuestionRepository {
  public abstract get(id: string): Promise<Question | undefined>;

  public abstract create(question: Question): Promise<string>;

  public abstract update(question: Question): Promise<boolean>;

  public abstract delete(id: string): Promise<boolean>;

  public abstract getRandom(amount: number): Promise<Question[]>;
}
