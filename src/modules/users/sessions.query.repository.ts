import SessionViewModel from './models/view/session.view.model';

export default abstract class SessionsQueryRepository {
  public abstract get(userId: string): Promise<SessionViewModel[]>;
}
