import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { init, stop } from './utils/test.init';
import { regex } from '../src/common/utils/validation.regex';
import UserSampleGenerator, { Tokens } from './utils/user.sample.generator';
import UserViewModel from '../src/modules/users/models/view/user.view.model';
import IdGenerator from '../src/common/utils/id.generator';
import { QuizViewModel } from '../src/modules/quiz/models/view/quiz.view.model';
import * as config from '../src/config/admin';
import { QuestionViewModel } from '../src/modules/quiz/models/view/question.view.model';
import { QuestionSampleGenerator } from './utils/question.sample.generator';
import { AnswerInfo } from '../src/modules/quiz/models/view/player.progress';
import PageViewModel from '../src/common/models/page.view.model';

jest.useRealTimers();

describe('QuizController (e2e)', () => {
  const base = '/pair-game-quiz';
  let app: INestApplication;

  let samples: UserSampleGenerator;
  let questionSamples: QuestionSampleGenerator;
  let users: Array<UserViewModel & Tokens>;

  beforeAll(async () => {
    app = await init();
    await request(app.getHttpServer()).delete('/testing/all-data');

    samples = new UserSampleGenerator(app);
    samples.generateSamples(3);
    await samples.createSamples();

    questionSamples = new QuestionSampleGenerator(app);
    questionSamples.generateSamples(10);
    await questionSamples.createSamples();
    await questionSamples.publishCreated();

    users = [];
    for (const s of samples.samples) {
      const tokens = await samples.login(s);
      const user = samples.outputs.find((u) => u.login === s.login);
      users.push({ ...user, ...tokens });
    }
  }, 10000);

  afterAll(async () => {
    await stop();
  });

  it('unauthorized access', async () => {
    const noAuth = [
      request(app.getHttpServer()).get(`${base}/pairs/my-current`),
      request(app.getHttpServer()).get(`${base}/pairs/my`),
      request(app.getHttpServer()).get(`${base}/users/my-statistic`),
      request(app.getHttpServer()).get(
        `${base}/pairs/${IdGenerator.generate()}`,
      ),
      request(app.getHttpServer())
        .post(`${base}/pairs/connection`)
        .send('poop!'),
      request(app.getHttpServer())
        .post(`${base}/pairs/my-current/answers`)
        .send('poop!'),
    ];
    const noAuthResults = await Promise.all(noAuth);
    for (const res of noAuthResults) {
      expect(res.statusCode).toBe(401);
    }
  });

  it('user1 should get no current game', async () => {
    await request(app.getHttpServer())
      .get(`${base}/pairs/my-current`)
      .set('Authorization', `Bearer ${users[0].access}`)
      .expect(404);
  });

  it('users should get empty stats', async () => {
    const expected = {
      sumScore: 0,
      avgScores: 0,
      gamesCount: 0,
      winsCount: 0,
      lossesCount: 0,
      drawsCount: 0,
    };

    let response = await request(app.getHttpServer())
      .get(`${base}/users/my-statistic`)
      .set('Authorization', `Bearer ${users[0].access}`)
      .expect(200);

    expect(response.body).toEqual(expected);

    response = await request(app.getHttpServer())
      .get(`${base}/users/my-statistic`)
      .set('Authorization', `Bearer ${users[1].access}`)
      .expect(200);

    expect(response.body).toEqual(expected);
  });

  let game: QuizViewModel;
  it('user1 should create new game', async () => {
    const result = await request(app.getHttpServer())
      .post(`${base}/pairs/connection`)
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
      .post(`${base}/pairs/connection`)
      .set('Authorization', `Bearer ${users[0].access}`)
      .send({});

    expect(result.statusCode).toBe(403);
  });

  it('user1 should get pending game', async () => {
    const result = await request(app.getHttpServer())
      .get(`${base}/pairs/my-current`)
      .set('Authorization', `Bearer ${users[0].access}`);

    expect(result.statusCode).toBe(200);
    const body = result.body as QuizViewModel;
    expect(body).toEqual(game);
  });

  it('user2 should not get current game', async () => {
    await request(app.getHttpServer())
      .get(`${base}/pairs/my-current`)
      .set('Authorization', `Bearer ${users[1].access}`)
      .expect(404);
  });

  it('user2 should join user1 game', async () => {
    const result = await request(app.getHttpServer())
      .post(`${base}/pairs/connection`)
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
      .get(`${base}/pairs/my-current`)
      .set('Authorization', `Bearer ${users[0].access}`);

    expect(result.statusCode).toBe(200);
    const body = result.body as QuizViewModel;
    expect(body).toEqual(game);
  });

  let questions: Array<QuestionViewModel>;
  it('get all answers as admin', async () => {
    questions = [];
    for (const q of game.questions) {
      const result = await request(app.getHttpServer())
        .get(`/sa/quiz/questions/${q.id}`)
        .auth(config.userName, config.password)
        .expect(200);

      const body = result.body as QuestionViewModel;
      expect(body.correctAnswers.length).toBeGreaterThan(0);
      questions.push(body);
    }
  });

  it('try to send an answer as user3', async () => {
    const u3 = await request(app.getHttpServer())
      .post(`${base}/pairs/my-current/answers`)
      .set('Authorization', `Bearer ${users[2].access}`)
      .send({ answer: 'sorry, idk' })
      .expect(403);
  });

  it('start the game sequential', async () => {
    const u1 = await request(app.getHttpServer())
      .post(`${base}/pairs/my-current/answers`)
      .set('Authorization', `Bearer ${users[0].access}`)
      .send({ answer: 'sorry, idk' })
      .expect(200);

    const u2 = await request(app.getHttpServer())
      .post(`${base}/pairs/my-current/answers`)
      .set('Authorization', `Bearer ${users[1].access}`)
      .send({ answer: questions[0].correctAnswers[0] })
      .expect(200);

    expect(u1.body).toEqual({
      questionId: questions[0].id,
      answerStatus: 'Incorrect',
      addedAt: expect.stringMatching(regex.isoDate),
    });
    expect(u2.body).toEqual({
      questionId: questions[0].id,
      answerStatus: 'Correct',
      addedAt: expect.stringMatching(regex.isoDate),
    });
  });

  it('continue game concurrent', async () => {
    for (let i = 1; i < 3; i++) {
      const u1 = request(app.getHttpServer())
        .post(`${base}/pairs/my-current/answers`)
        .set('Authorization', `Bearer ${users[0].access}`)
        .send({ answer: `user1, question ${i}` })
        .expect(200);

      const u2 = request(app.getHttpServer())
        .post(`${base}/pairs/my-current/answers`)
        .set('Authorization', `Bearer ${users[1].access}`)
        .send({ answer: `user2, question ${i}` })
        .expect(200);

      const results = await Promise.all([u1, u2]);

      expect(results[0].body).toEqual({
        questionId: questions[i].id,
        answerStatus: 'Incorrect',
        addedAt: expect.stringMatching(regex.isoDate),
      });
      expect(results[1].body).toEqual({
        questionId: questions[i].id,
        answerStatus: 'Incorrect',
        addedAt: expect.stringMatching(regex.isoDate),
      });
    }
  });

  it('Send right answers concurrent', async () => {
    const u1 = request(app.getHttpServer())
      .post(`${base}/pairs/my-current/answers`)
      .set('Authorization', `Bearer ${users[0].access}`)
      .send({ answer: questions[3].correctAnswers[0] })
      .expect(200);

    const u2 = request(app.getHttpServer())
      .post(`${base}/pairs/my-current/answers`)
      .set('Authorization', `Bearer ${users[1].access}`)
      .send({ answer: questions[3].correctAnswers[1] })
      .expect(200);

    const results = await Promise.all([u1, u2]);

    expect(results[0].body).toEqual({
      questionId: questions[3].id,
      answerStatus: 'Correct',
      addedAt: expect.stringMatching(regex.isoDate),
    });
    expect(results[1].body).toEqual({
      questionId: questions[3].id,
      answerStatus: 'Correct',
      addedAt: expect.stringMatching(regex.isoDate),
    });
  });

  it('check game status after answers', async () => {
    const result = await request(app.getHttpServer())
      .get(`${base}/pairs/my-current`)
      .set('Authorization', `Bearer ${users[0].access}`);

    expect(result.statusCode).toBe(200);
    const body = result.body as QuizViewModel;
    expect(body).toEqual({
      ...game,
      firstPlayerProgress: {
        ...game.firstPlayerProgress,
        answers: [
          {
            questionId: expect.stringMatching(regex.uuid),
            answerStatus: 'Incorrect',
            addedAt: expect.stringMatching(regex.isoDate),
          },
          {
            questionId: expect.stringMatching(regex.uuid),
            answerStatus: 'Incorrect',
            addedAt: expect.stringMatching(regex.isoDate),
          },
          {
            questionId: expect.stringMatching(regex.uuid),
            answerStatus: 'Incorrect',
            addedAt: expect.stringMatching(regex.isoDate),
          },
          {
            questionId: expect.stringMatching(regex.uuid),
            answerStatus: 'Correct',
            addedAt: expect.stringMatching(regex.isoDate),
          },
        ],
        score: 1,
      },
      secondPlayerProgress: {
        ...game.secondPlayerProgress,
        answers: [
          {
            questionId: expect.stringMatching(regex.uuid),
            answerStatus: 'Correct',
            addedAt: expect.stringMatching(regex.isoDate),
          },
          {
            questionId: expect.stringMatching(regex.uuid),
            answerStatus: 'Incorrect',
            addedAt: expect.stringMatching(regex.isoDate),
          },
          {
            questionId: expect.stringMatching(regex.uuid),
            answerStatus: 'Incorrect',
            addedAt: expect.stringMatching(regex.isoDate),
          },
          {
            questionId: expect.stringMatching(regex.uuid),
            answerStatus: 'Correct',
            addedAt: expect.stringMatching(regex.isoDate),
          },
        ],
        score: 2,
      },
    });
    game = body;
  });

  it('user1 sends the last answer, game should not be ended', async () => {
    const u1 = await request(app.getHttpServer())
      .post(`${base}/pairs/my-current/answers`)
      .set('Authorization', `Bearer ${users[0].access}`)
      .send({ answer: questions.at(-1).correctAnswers.at(-1) })
      .expect(200);

    expect(u1.body).toEqual({
      questionId: questions.at(-1).id,
      addedAt: expect.stringMatching(regex.isoDate),
      answerStatus: 'Correct',
    });

    const status = await request(app.getHttpServer())
      .get(`${base}/pairs/my-current`)
      .set('Authorization', `Bearer ${users[0].access}`);

    expect(status.body).toEqual({
      ...game,
      firstPlayerProgress: {
        ...game.firstPlayerProgress,
        answers: [
          ...game.firstPlayerProgress.answers,
          {
            questionId: expect.stringMatching(regex.uuid),
            answerStatus: 'Correct',
            addedAt: expect.stringMatching(regex.isoDate),
          },
        ],
        score: 2,
      },
    });

    game = status.body as QuizViewModel;
  });

  it('Users should still get empty stats', async () => {
    const expected = {
      sumScore: 0,
      avgScores: 0,
      gamesCount: 0,
      winsCount: 0,
      lossesCount: 0,
      drawsCount: 0,
    };

    const response = await request(app.getHttpServer())
      .get(`${base}/users/my-statistic`)
      .set('Authorization', `Bearer ${users[0].access}`)
      .expect(200);

    expect(response.body).toEqual(expected);
  });

  it('user1 should not be able to send more answers', async () => {
    const u1 = await request(app.getHttpServer())
      .post(`${base}/pairs/my-current/answers`)
      .set('Authorization', `Bearer ${users[0].access}`)
      .send({ answer: questions.at(-1).correctAnswers.at(-1) })
      .expect(403);
  });

  it('user1 should get current game until user2 sends the last answer', async () => {
    const result = await request(app.getHttpServer())
      .get(`${base}/pairs/my-current`)
      .set('Authorization', `Bearer ${users[0].access}`)
      .expect(200);

    expect(result.body).toEqual(game);
  });

  it('user2 sends the last answer, should get ended game result', async () => {
    const u2 = await request(app.getHttpServer())
      .post(`${base}/pairs/my-current/answers`)
      .set('Authorization', `Bearer ${users[1].access}`)
      .send({ answer: 'Doesnt matter' })
      .expect(200);

    const answer = u2.body as AnswerInfo;
    expect(answer).toEqual({
      questionId: questions.at(-1).id,
      addedAt: expect.stringMatching(regex.isoDate),
      answerStatus: 'Incorrect',
    });

    const status = await request(app.getHttpServer())
      .get(`${base}/pairs/${game.id}`)
      .set('Authorization', `Bearer ${users[1].access}`);

    const body = status.body as QuizViewModel;
    expect(body).toEqual({
      ...game,
      firstPlayerProgress: {
        ...game.firstPlayerProgress,
        score: 3, // Time bonus
      },
      secondPlayerProgress: {
        ...game.secondPlayerProgress,
        answers: [
          ...game.secondPlayerProgress.answers,
          {
            questionId: questions.at(-1).id,
            answerStatus: 'Incorrect',
            addedAt: expect.stringMatching(regex.isoDate),
          },
        ],
      },
      status: 'Finished',
      finishGameDate: expect.stringMatching(regex.isoDate),
    });

    game = body;
  });

  it('user1 should not get my-current', async () => {
    const result = await request(app.getHttpServer())
      .get(`${base}/pairs/my-current`)
      .set('Authorization', `Bearer ${users[0].access}`);

    expect(result.statusCode).toBe(404);
  });

  it('user3 should not be able to get game by id', async () => {
    const result = await request(app.getHttpServer())
      .get(`${base}/pairs/${game.id}`)
      .set('Authorization', `Bearer ${users[2].access}`);

    expect(result.statusCode).toBe(403);
  });

  it('user1 should get his own games list', async () => {
    const result = await request(app.getHttpServer())
      .get(`${base}/pairs/my?sortBy=status`)
      .set('Authorization', `Bearer ${users[0].access}`);

    expect(result.statusCode).toBe(200);
    const body = result.body as PageViewModel<QuizViewModel>;

    expect(body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [game],
    });
  });

  it('users should get new stats', async () => {
    let expected = {
      sumScore: 3,
      avgScores: 3,
      gamesCount: 1,
      winsCount: 1,
      lossesCount: 0,
      drawsCount: 0,
    };

    let response = await request(app.getHttpServer())
      .get(`${base}/users/my-statistic`)
      .set('Authorization', `Bearer ${users[0].access}`)
      .expect(200);

    expect(response.body).toEqual(expected);

    expected = {
      sumScore: 0,
      avgScores: 0,
      gamesCount: 1,
      winsCount: 0,
      lossesCount: 1,
      drawsCount: 0,
    };

    response = await request(app.getHttpServer())
      .get(`${base}/users/my-statistic`)
      .set('Authorization', `Bearer ${users[1].access}`)
      .expect(200);

    expect(response.body).toEqual(expected);
  });
});
