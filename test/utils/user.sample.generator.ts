import * as request from 'supertest';
import UserInputModel from '../../src/modules/users/models/user.input.model';
import UserViewModel from '../../src/modules/users/models/user.view.model';
import TestSampleGenerator from './test.sample.generator';
import * as config from '../../src/config/admin';

export type Tokens = { access: string; refresh: string };

export default class UserSampleGenerator extends TestSampleGenerator<
  UserInputModel,
  UserViewModel
> {
  public override generateSamples(length: number): Array<UserInputModel> {
    for (let i = 0; i < length; i++) {
      const rand = this.rand();
      this.samples.push({
        login: `sampleUser${rand}`,
        email: `youser${rand}@example.com`,
        password: `assword${rand}`,
      });
    }
    return this.getLastSamples(length);
  }
  public override async createOne(
    sample: UserInputModel,
  ): Promise<UserViewModel> {
    const created = await request(this.app.getHttpServer())
      .post('/users')
      .auth(config.userName, config.password)
      .send(sample);
    return created.body as UserViewModel;
  }
  public async login(sample: UserInputModel): Promise<Tokens> {
    const res = await request(this.app.getHttpServer())
      .post('/auth/login')
      .send({ loginOrEmail: sample.login, password: sample.password });
    return {
      access: res.body.accessToken,
      refresh: this.parseRefreshCookie(res.get('Set-Cookie')),
    };
  }
  private parseRefreshCookie(cookies: string[]): string {
    const cookie = cookies.find((q) => q.includes('refreshToken'));
    return cookie ? cookie : '';
  }
}
