import * as request from 'supertest';
import { init, stop } from './utils/test.init';
import { INestApplication } from '@nestjs/common';
import * as config from '../src/config/admin';
import { QuestionSampleGenerator } from './utils/question.sample.generator';
import { regex } from '../src/common/utils/validation.regex';
import PageViewModel from '../src/common/models/page.view.model';
import { QuestionViewModel } from '../src/modules/quiz/models/view/question.view.model';

describe('AdminQuizController (e2e)', () => {
  const base = '/sa/quiz/questions';
  let app: INestApplication;

  const emptyPage = {
    pagesCount: 0,
    page: 1,
    pageSize: expect.any(Number),
    totalCount: 0,
    items: [],
  };
  const viewModel = {
    id: expect.stringMatching(regex.uuid),
    body: expect.any(String),
    correctAnswers: expect.any(Array<string>),
    published: expect.any(Boolean),
    createdAt: expect.stringMatching(regex.isoDate),
    updatedAt: null,
  };

  beforeAll(async () => {
    app = await init();
    await request(app.getHttpServer()).delete('/testing/all-data');
  }, 10000);
  afterAll(async () => {
    await stop();
  });

  describe('admin unauthorized', () => {
    it('unauthorized if no auth', async () => {
      const noAuth = [
        request(app.getHttpServer()).get(base),
        request(app.getHttpServer()).post(base).send('poop!'),
        request(app.getHttpServer()).delete(`${base}/fafafafaf78787`),
        request(app.getHttpServer()).put(`${base}/fafafafaf78787`).send('ohno'),
        request(app.getHttpServer())
          .put(`${base}/fafafafaf78787/publish`)
          .send('ohno'),
      ];
      const noAuthResults = await Promise.all(noAuth);
      for (const res of noAuthResults) {
        expect(res.statusCode).toBe(401);
      }
    });
    it('unauthorized if wrong credentials', async () => {
      const noAuth = [
        request(app.getHttpServer()).get(base).auth(config.userName, 'hell-o'),
        request(app.getHttpServer())
          .post(base)
          .auth('config.userName', 'hell-o')
          .send('poop!'),
        request(app.getHttpServer())
          .delete(`${base}/fafafafaf78787`)
          .auth('admin', 'password'),
        request(app.getHttpServer())
          .put(`${base}/fafafafaf78787`)
          .auth('moolya', config.password)
          .send('ohno'),
        request(app.getHttpServer())
          .put(`${base}/fafafafaf78787/publish`)
          .auth('', '')
          .send('ohno'),
      ];
      const noAuthResults = await Promise.all(noAuth);
      for (const res of noAuthResults) {
        expect(res.statusCode).toBe(401);
      }
    });
  });

  describe('questions crud', () => {
    let samples: QuestionSampleGenerator;
    const amount = 17;

    beforeAll(() => {
      samples = new QuestionSampleGenerator(app);
      samples.generateSamples(amount);
    });
    it('should get empty page', async () => {
      const response = await request(app.getHttpServer())
        .get(base)
        .auth(config.userName, config.password);
      expect(response.body).toEqual(emptyPage);
    });

    it('should return 400 on wrong format', async () => {
      const wrong = [
        {},
        { body: 'dobry vecher dorogie radioslushateli' },
        {
          correctAnswers: [
            'my mother was a taylor. she sewed my new blue jeans.',
          ],
        },
        {
          body: '                           ',
          correctAnswers: ['this is what i call the wrong body'],
        },
        {
          body: 'totally correct body',
          correctAnsers: [],
        },
      ];
      wrong.forEach(async (w) => {
        await request(app.getHttpServer())
          .post('/sa/quiz/questions')
          .auth(config.userName, config.password)
          .send(w)
          .expect(400);
      });
    });

    it('should create samples', async () => {
      await samples.createSamples();
      expect(samples.outputs.length).toBe(amount);

      for (const q of samples.outputs) {
        expect(q).toEqual(viewModel);
      }
      for (const s of samples.samples) {
        const match = samples.outputs.some((o) => {
          if (o.body !== s.body) return false;
          return o.correctAnswers.toString() === s.correctAnswers.toString();
        });
        expect(match).toBe(true);
      }
    });

    it('get all', async () => {
      samples.outputs.sort((a, b) => a.body.localeCompare(b.body));
      const result = await request(app.getHttpServer())
        .get(`${base}?sortBy=body&sortDirection=asc&pageSize=${amount}`)
        .auth(config.userName, config.password)
        .expect(200);
      const page = result.body as PageViewModel<QuestionViewModel>;
      expect(page).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: amount,
        totalCount: amount,
        items: samples.outputs,
      });
    });

    let published: QuestionViewModel;
    it('publish question', async () => {
      published = samples.outputs[Math.floor(samples.outputs.length / 2)];
      await request(app.getHttpServer())
        .put(`${base}/${published.id}/publish`)
        .auth(config.userName, config.password)
        .send({ published: true })
        .expect(204);

      const result = await request(app.getHttpServer())
        .get(`${base}/${published.id}`)
        .auth(config.userName, config.password)
        .expect(200);

      const retrieved = result.body as QuestionViewModel;
      expect(retrieved).toEqual({
        ...published,
        published: true,
        updatedAt: expect.stringMatching(regex.isoDate),
      });
      expect(retrieved.updatedAt).not.toBe(published.updatedAt);
      published = retrieved;
    });

    let updated: QuestionViewModel;
    it('update question', async () => {
      updated = samples.outputs[1];
      const newData = {
        body: 'Oh, hello there! Imma ask you some.',
        correctAnswers: ['No please no', 'Maybe tomorrow'],
      };
      await request(app.getHttpServer())
        .put(`${base}/${updated.id}`)
        .auth(config.userName, config.password)
        .send(newData)
        .expect(204);

      const result = await request(app.getHttpServer())
        .get(`${base}/${updated.id}`)
        .auth(config.userName, config.password)
        .expect(200);

      const retrieved = result.body as QuestionViewModel;
      expect(retrieved).toEqual({
        ...updated,
        ...newData,
        updatedAt: expect.stringMatching(regex.isoDate),
      });
      expect(retrieved.updatedAt).not.toBe(updated.updatedAt);
      updated = retrieved;
    });

    let deleted: QuestionViewModel;
    it('delete question', async () => {
      deleted = samples.outputs[amount - 2];
      await request(app.getHttpServer())
        .delete(`${base}/${deleted.id}`)
        .auth(config.userName, config.password)
        .expect(204);

      const result = await request(app.getHttpServer())
        .get(`${base}/${deleted.id}`)
        .auth(config.userName, config.password);

      expect(result.status).toBe(404);
    });

    it('get updated all', async () => {
      samples.outputs.forEach((o, i, list) => {
        if (o.id === published.id) {
          list[i] = published;
          return;
        }
        if (o.id === updated.id) {
          list[i] = updated;
          return;
        }
        if (o.id === deleted.id) {
          list.splice(i, 1);
        }
      });

      expect(samples.outputs.length).toBe(amount - 1);
      samples.outputs.sort((a, b) => a.body.localeCompare(b.body));

      const result = await request(app.getHttpServer())
        .get(`${base}?sortBy=body&sortDirection=asc&pageSize=${amount}`)
        .auth(config.userName, config.password)
        .expect(200);
      const page = result.body as PageViewModel<QuestionViewModel>;
      expect(page).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: amount,
        totalCount: amount - 1,
        items: samples.outputs,
      });
    });
  });
});
