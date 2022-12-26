import SessionModel from '../../../models/session.model';
import { Session } from '../session';
import SessionViewModel from '../../../models/view/session.view.model';
import { SessionDto } from '../../../models/dto/session.dto';

export default class SessionMapper {
  public static fromDomain(model: SessionModel): Session {
    return new Session(model.toDto());
  }
  public static toDomain(model: Session): SessionModel {
    return new SessionModel(
      new SessionDto(
        model.deviceId,
        model.deviceName,
        model.ip,
        model.userId,
        model.user.login,
        model.issuedAt,
        model.expiresAt,
      ),
    );
  }
  public static toView(model: Session): SessionViewModel {
    return new SessionViewModel(
      model.ip,
      model.deviceName,
      model.issuedAt.toISOString(),
      model.deviceId,
    );
  }
}
