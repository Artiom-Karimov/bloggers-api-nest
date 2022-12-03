import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { init, stop } from './utils/test.init';
import UserSampleGenerator, { Tokens } from './utils/user.sample.generator';
import UserInputModel from '../src/modules/users/models/user.input.model';
import EmailConfirmationRepository from '../src/modules/users/email.confirmation.repository';
import UsersRepository from '../src/modules/users/users.repository';
import RecoveryRepository from '../src/modules/auth/recovery.repository';
import { dateRegex } from '../src/common/utils/date.generator';
import SessionViewModel from '../src/modules/auth/models/session/session.view.model';

jest.useRealTimers();

describe('DevicesController (e2e)', () => {
  let app: INestApplication;
  let samples: UserSampleGenerator;
  const tokens: Tokens[] = [];

  beforeAll(async () => {
    app = await init();
    samples = new UserSampleGenerator(app);
    await request(app.getHttpServer()).delete('/testing/all-data');
    samples.generateOne();
    await samples.createSamples();
  }, 10000);
  afterAll(async () => {
    await stop();
  });

  it('create 4 sessions for sample user', async () => {
    for (let i = 0; i < 4; i++) {
      tokens.push(await samples.login(samples.samples[0]));
    }
    expect(tokens.length).toBe(4);
  });

  let sessions: SessionViewModel[];
  it('devices list should contain 4 elements', async () => {
    const res = await request(app.getHttpServer())
      .get('/security/devices')
      .set('Cookie', [tokens[0].refresh])
      .expect(200);
    const body = res.body as SessionViewModel[];
    expect(body).toContainEqual({
      ip: expect.any(String),
      title: expect.any(String),
      lastActiveDate: expect.stringMatching(dateRegex),
      deviceId: expect.any(String),
    });
    expect(body.length).toBe(4);
    sessions = body;
  });

  it('device should be removed', async () => {
    const device = sessions.pop();
    await request(app.getHttpServer())
      .delete(`/security/devices/${device.deviceId}`)
      .set('Cookie', [tokens[0].refresh])
      .expect(204);
  });

  it('device list should contain 3 devices', async () => {
    let res = await request(app.getHttpServer())
      .get('/security/devices')
      .set('Cookie', [tokens[0].refresh]);
    if (res.statusCode !== 200) {
      tokens.unshift();
      res = await request(app.getHttpServer())
        .get('/security/devices')
        .set('Cookie', [tokens[0].refresh]);
    }
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(sessions);
  });

  it('all sessions except current should be removed', async () => {
    await request(app.getHttpServer())
      .delete(`/security/devices/`)
      .set('Cookie', [tokens[0].refresh])
      .expect(204);

    const res = await request(app.getHttpServer())
      .get('/security/devices')
      .set('Cookie', [tokens[0].refresh]);
    const body = res.body as SessionViewModel[];
    expect(body.length).toBe(1);
  });

  it('deleted session should not be accepted', async () => {
    await request(app.getHttpServer())
      .delete(`/security/devices/`)
      .set('Cookie', [tokens[1].refresh])
      .expect(401);
  });
});
