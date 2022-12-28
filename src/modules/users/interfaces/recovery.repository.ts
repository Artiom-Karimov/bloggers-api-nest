import { Recovery } from '../typeorm/models/recovery';

export default abstract class RecoveryRepository {
  public abstract get(userId: string): Promise<Recovery | undefined>;

  public abstract getByCode(code: string): Promise<Recovery | undefined>;

  public abstract createOrUpdate(model: Recovery): Promise<boolean>;

  public abstract delete(userId: string): Promise<boolean>;
}
