import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { init, stop } from './utils/test.init';
import { regex } from '../src/common/utils/validation.regex';
import UserSampleGenerator, { Tokens } from './utils/user.sample.generator';
import UserViewModel from '../src/modules/users/models/view/user.view.model';
import IdGenerator from '../src/common/utils/id.generator';
import { QuizViewModel } from '../src/modules/quiz/models/view/quiz.view.model';

jest.useRealTimers();

describe('QuizController (e2e)', () => {
  const base = '/pair-game-quiz/pairs';
  let app: INestApplication;

  let samples: UserSampleGenerator;
  let users: Array<UserViewModel & Tokens>;

  beforeAll(async () => {
    app = await init();
    await request(app.getHttpServer()).delete('/testing/all-data');

    samples = new UserSampleGenerator(app);
    samples.generateSamples(3);
    await samples.createSamples();

    users = [];
    for (const s of samples.samples) {
      const tokens = await samples.login(s);
      const user = samples.outputs.find((u) => u.login === s.login);
      users.push({ ...user, ...tokens });
    }
  }, 10000);

  it('unauthorized access', async () => {
    const noAuth = [
      request(app.getHttpServer()).get(`${base}/my-current`),
      request(app.getHttpServer()).get(`${base}/${IdGenerator.generate()}`),
      request(app.getHttpServer()).post(`${base}/connection`).send('poop!'),
      request(app.getHttpServer())
        .post(`${base}/my-current/answers`)
        .send('poop!'),
    ];
    const noAuthResults = await Promise.all(noAuth);
    for (const res of noAuthResults) {
      expect(res.statusCode).toBe(401);
    }
  });

  it('user1 should get no current game', async () => {
    await request(app.getHttpServer())
      .get(`${base}/my-current`)
      .set('Authorization', `Bearer ${users[0].access}`)
      .expect(404);
  });

  let game: QuizViewModel;
  it('user1 should create new game', async () => {
    const result = await request(app.getHttpServer())
      .post(`${base}/connection`)
      .set('Authorization', `Bearer ${users[0].access}`)
      .send({});

    expect(result.statusCode).toBe(200);
    const body = result.body as QuizViewModel;
    expect(body).toEqual({
      id: expect.stringMatching(regex.uuid),
      firstPlayerProgress: {
        answers: [],
        player: {
          id: users[0].id,
          login: users[0].login,
        },
        score: 0,
      },
      secondPlayerProgress: null,
      questions: null,
      status: 'PendingSecondPlayer',
      pairCreatedDate: expect.stringMatching(regex.isoDate),
      startGameDate: null,
      finishGameDate: null,
    });

    game = body;
  });

  it('user1 should not create another game', async () => {
    const result = await request(app.getHttpServer())
      .post(`${base}/connection`)
      .set('Authorization', `Bearer ${users[0].access}`)
      .send({});

    expect(result.statusCode).toBe(403);
  });

  it('user1 should get pending game', async () => {
    const result = await request(app.getHttpServer())
      .get(`${base}/my-current`)
      .set('Authorization', `Bearer ${users[0].access}`);

    expect(result.statusCode).toBe(200);
    const body = result.body as QuizViewModel;
    expect(body).toEqual(game);
  });

  it('user2 should not get current game', async () => {
    await request(app.getHttpServer())
      .get(`${base}/my-current`)
      .set('Authorization', `Bearer ${users[1].access}`)
      .expect(404);
  });

  it('user2 should join user1 game', async () => {
    const result = await request(app.getHttpServer())
      .post(`${base}/connection`)
      .set('Authorization', `Bearer ${users[1].access}`)
      .send({});

    expect(result.statusCode).toBe(200);
    const body = result.body as QuizViewModel;

    expect(body).toEqual({
      ...game,
      secondPlayerProgress: {
        answers: [],
        player: {
          id: users[1].id,
          login: users[1].login,
        },
        score: 0,
      },
      questions: [
        { id: expect.stringMatching(regex.uuid), body: expect.any(String) },
        { id: expect.stringMatching(regex.uuid), body: expect.any(String) },
        { id: expect.stringMatching(regex.uuid), body: expect.any(String) },
        { id: expect.stringMatching(regex.uuid), body: expect.any(String) },
        { id: expect.stringMatching(regex.uuid), body: expect.any(String) },
      ],
      status: 'Active',
      startGameDate: expect.stringMatching(regex.isoDate),
    });

    game = body;
  });

  it('user1 should get the same game', async () => {
    const result = await request(app.getHttpServer())
      .get(`${base}/my-current`)
      .set('Authorization', `Bearer ${users[0].access}`);

    expect(result.statusCode).toBe(200);
    const body = result.body as QuizViewModel;
    expect(body).toEqual(game);
  });
});
