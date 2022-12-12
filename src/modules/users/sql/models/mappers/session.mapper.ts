import SessionModel from '../../../models/session.model';
import Session from '../session';
import SessionViewModel from '../../../models/view/session.view.model';

export default class SessionMapper {
  public static fromDomain(model: SessionModel): Session {
    return new Session(
      model.deviceId,
      model.deviceName,
      model.ip,
      model.userId,
      model.userLogin,
      new Date(model.issuedAt),
      new Date(model.expiresAt),
    );
  }
  public static toDomain(model: Session): SessionModel {
    return new SessionModel(
      model.ip,
      model.deviceId,
      model.deviceName,
      model.userId,
      model.userLogin,
      model.issuedAt.getTime(),
      model.expiresAt.getTime(),
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
