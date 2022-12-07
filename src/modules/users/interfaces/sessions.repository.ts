import SessionModel from '../models/session.model';

export default abstract class SessionsRepository {
  public abstract get(deviceId: string): Promise<SessionModel | undefined>;

  public abstract create(session: SessionModel): Promise<string | undefined>;

  public abstract update(session: SessionModel): Promise<boolean>;

  public abstract delete(deviceId: string): Promise<boolean>;

  public abstract deleteAllButOne(
    userId: string,
    deviceId: string,
  ): Promise<number>;

  public abstract deleteAll(userId: string): Promise<number>;
}
