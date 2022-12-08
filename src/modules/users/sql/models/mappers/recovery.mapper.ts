import RecoveryModel from '../../../models/recovery.model';
import Recovery from '../recovery';

export default class RecoveryMapper {
  public static fromDomain(model: RecoveryModel): Recovery {
    return new Recovery(model.userId, model.code, new Date(model.expiresAt));
  }
  public static toDomain(model: Recovery): RecoveryModel {
    return new RecoveryModel(
      model.userId,
      model.code,
      model.expiration.getTime(),
    );
  }
}
