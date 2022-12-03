import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { init, moduleFixture, stop } from './utils/test.init';
import UserSampleGenerator from './utils/user.sample.generator';
import UserInputModel from '../src/modules/users/models/user.input.model';
import EmailConfirmationRepository from '../src/modules/users/email.confirmation.repository';
import UsersRepository from '../src/modules/users/users.repository';

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

  describe('registrtion procedure', () => {
    let user: UserInputModel;
    let userRepo: UsersRepository;
    let emailRepo: EmailConfirmationRepository;

    beforeAll(async () => {
      const samples = new UserSampleGenerator(app);
      await request(app.getHttpServer()).delete('/testing/all-data');
      user = samples.generateOne();
      userRepo = await moduleFixture.resolve(UsersRepository);
      emailRepo = await moduleFixture.resolve(EmailConfirmationRepository);
    });

    it('registration should succeed', async () => {
      await request(app.getHttpServer())
        .post('/auth/registration')
        .send(user)
        .expect(204);
    });

    it('unconfirmed user should not login', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ loginOrEmail: user.login, password: user.password })
        .expect(401);
    });

    let code: string;
    it('code should be stored in db', async () => {
      const dbUser = await userRepo.getByLoginOrEmail(user.login);
      expect(dbUser).toBeTruthy();
      const confirmation = await emailRepo.getByUser(dbUser.id);
      expect(confirmation).toEqual({
        id: dbUser.id,
        confirmed: false,
        code: expect.any(String),
        expiration: expect.any(Number),
      });
      code = confirmation.code;
    });

    it('confirmation code should be accepted', async () => {
      await request(app.getHttpServer())
        .post('/auth/registration-confirmation')
        .send({ code })
        .expect(204);
    });

    it('confirmed user should login', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ loginOrEmail: user.login, password: user.password })
        .expect(200);

      expect(response.body).toEqual({
        accessToken: expect.any(String),
      });
      const cookies = response.get('Set-Cookie');
      const cookie = cookies.find((q) => q.includes('refreshToken'));
      expect(cookie).not.toBeUndefined();
    });
  });
});
