import RecoveryModel from '../models/recovery.model';

export default abstract class RecoveryRepository {
  public abstract get(userId: string): Promise<RecoveryModel | undefined>;

  public abstract getByCode(code: string): Promise<RecoveryModel | undefined>;

  public abstract createOrUpdate(model: RecoveryModel): Promise<boolean>;

  public abstract delete(userId: string): Promise<boolean>;
}
