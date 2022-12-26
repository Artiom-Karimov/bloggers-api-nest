import { RecoveryDto } from '../../../models/dto/recovery.dto';
import RecoveryModel from '../../../models/recovery.model';
import { Recovery } from '../recovery';

export default class RecoveryMapper {
  public static fromDomain(model: RecoveryModel): Recovery {
    return new Recovery(model.toDto());
  }
  public static toDomain(model: Recovery): RecoveryModel {
    return new RecoveryModel(
      new RecoveryDto(model.userId, model.code, model.expiration),
    );
  }
}
