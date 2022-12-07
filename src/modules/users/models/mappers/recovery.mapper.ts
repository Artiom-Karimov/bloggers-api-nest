import RecoveryModel from '../recovery.model';
import Recovery from '../../mongoose/models/recovery.schema';

export default class RecoveryMapper {
  public static fromDomain(model: RecoveryModel): Recovery {
    return new Recovery(model.userId, model.code, model.expiresAt);
  }
  public static toDomain(model: Recovery): RecoveryModel {
    return new RecoveryModel(model._id, model.code, model.expiresAt);
  }
}
