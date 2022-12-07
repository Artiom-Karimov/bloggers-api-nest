import RecoveryModel from '../../../models/recovery.model';
import Recovery from '../recovery.schema';

export default class RecoveryMapper {
  public static fromDomain(model: RecoveryModel): Recovery {
    return new Recovery(model.userId, model.code, model.expiresAt);
  }
  public static toDomain(model: Recovery): RecoveryModel {
    return new RecoveryModel(model._id, model.code, model.expiresAt);
  }
}
