import { Session } from '../typeorm/models/session';

export default abstract class SessionsRepository {
  public abstract get(deviceId: string): Promise<Session | undefined>;

  public abstract create(session: Session): Promise<string | undefined>;

  public abstract update(session: Session): Promise<boolean>;

  public abstract delete(deviceId: string): Promise<boolean>;

  public abstract deleteAllButOne(
    userId: string,
    deviceId: string,
  ): Promise<number>;

  public abstract deleteAll(userId: string): Promise<number>;
}
