import * as request from 'supertest';
import { QuestionInputModel } from '../../src/modules/quiz/models/input/question.input.model';
import { QuestionViewModel } from '../../src/modules/quiz/models/view/question.view.model';
import TestSampleGenerator from './test.sample.generator';
import * as config from '../../src/config/admin';

export class QuestionSampleGenerator extends TestSampleGenerator<
  QuestionInputModel,
  QuestionViewModel
> {
  public generateOne(): QuestionInputModel {
    const rand = this.rand();
    const sample = {
      body: `The very-smart-question-${rand}`,
      correctAnswers: [
        `The ${rand}th in history`,
        `I am ${rand} feet tall`,
        `${rand} pounds.`,
      ],
    };
    this.samples.push(sample);
    return sample;
  }
  public override async createOne(
    sample: QuestionInputModel,
  ): Promise<QuestionViewModel> {
    const created = await request(this.app.getHttpServer())
      .post('/sa/quiz/questions')
      .auth(config.userName, config.password)
      .send(sample);
    return created.body as QuestionViewModel;
  }
  public async removeOne(id: string): Promise<void> {
    const req = request(this.app.getHttpServer())
      .delete(`/sa/quiz/questions/${id}`)
      .auth(config.userName, config.password);

    this.removeFromArrays(id, 'body');
    await req;
  }
  protected alreadyCreated(sample: QuestionInputModel): boolean {
    return this.outputs.some((o) => o.body === sample.body);
  }
}
