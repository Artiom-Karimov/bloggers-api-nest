import * as request from 'supertest';
import UserInputModel from '../../src/modules/users/models/input/user.input.model';
import UserViewModel from '../../src/modules/users/models/view/user.view.model';
import TestSampleGenerator from './test.sample.generator';
import * as config from '../../src/config/admin';

export type Tokens = { access: string; refresh: string };

export default class UserSampleGenerator extends TestSampleGenerator<
  UserInputModel,
  UserViewModel
> {
  public generateOne(): UserInputModel {
    const rand = this.rand();
    const sample = {
      login: `you-${rand}`,
      email: `youser${rand}@example.com`,
      password: `assword${rand}`,
    };
    this.samples.push(sample);
    return sample;
  }
  public override async createOne(
    sample: UserInputModel,
  ): Promise<UserViewModel> {
    const created = await request(this.app.getHttpServer())
      .post('/sa/users')
      .auth(config.userName, config.password)
      .send(sample);
    return created.body as UserViewModel;
  }
  public async removeOne(id: string): Promise<void> {
    const req = request(this.app.getHttpServer())
      .delete(`/sa/users/${id}`)
      .auth(config.userName, config.password);

    this.removeFromArrays(id, 'login');
    await req;
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

  protected alreadyCreated(sample: UserInputModel): boolean {
    return this.outputs.some((o) => o.login === sample.login);
  }
  protected parseRefreshCookie(cookies: string[]): string {
    const cookie = cookies.find((q) => q.includes('refreshToken'));
    return cookie ? cookie : '';
  }
}
