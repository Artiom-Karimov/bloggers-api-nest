import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { init, stop } from './utils/test.init';
import UserSampleGenerator from './utils/user.sample.generator';

jest.useRealTimers();

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await init();
  }, 10000);
  afterAll(async () => {
    await stop();
  });

  describe('Illegal Auth operations', () => {
    let samples: UserSampleGenerator;

    beforeAll(async () => {
      samples = new UserSampleGenerator(app);
      await request(app.getHttpServer()).delete('/testing/all-data');
    });

    it('register with invalid fields should fail', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/registration')
        .send({
          login: 'a',
          password: 'b',
          email: 'c',
        })
        .expect(400);

      expect(response.body).toEqual({
        errorsMessages: expect.arrayContaining([
          { field: 'login', message: expect.any(String) },
          { field: 'password', message: expect.any(String) },
          { field: 'email', message: expect.any(String) },
        ]),
      });
    });

    it('registration confirm with wrong code should get 400', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({ code: 'blah-blah-blah' })
        .expect(400);
      expect(response.body).toEqual({
        errorsMessages: [{ field: 'code', message: expect.any(String) }],
      });
    });

    it('email resending with wrong email should get 400', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/registration-email-resending')
        .send({ email: 'not.an.email@example.com' })
        .expect(400);
      expect(response.body).toEqual({
        errorsMessages: [{ field: 'email', message: expect.any(String) }],
      });
    });

    it('password recovery with wrong email should get 204', async () => {
      await request(app.getHttpServer())
        .post('/auth/password-recovery')
        .send({ email: 'not.an.email@example.com' })
        .expect(204);
    });

    it('user should not login with wrong credentials', async () => {
      const user = samples.generateOne();
      await samples.createSamples();

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ loginOrEmail: user.login, password: 'ohIForgot' })
        .expect(401);
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ loginOrEmail: user.email, password: 'ohIForgot' })
        .expect(401);
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ loginOrEmail: 'dontRemember', password: user.password })
        .expect(401);
    });

    it('unauthorized auth/me should get 401', async () => {
      await request(app.getHttpServer()).get('/auth/me').expect(401);
    });
  });
});
