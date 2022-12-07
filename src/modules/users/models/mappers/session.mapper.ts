import SessionModel from '../session.model';
import Session from '../../mongoose/models/session.schema';
import SessionViewModel from '../view/session.view.model';

export default class SessionMapper {
  public static fromDomain(model: SessionModel): Session {
    return new Session(
      model.deviceId,
      model.deviceName,
      model.ip,
      model.userId,
      model.issuedAt,
      model.expiresAt,
    );
  }
  public static toDomain(model: Session): SessionModel {
    return new SessionModel(
      model.ip,
      model._id,
      model.deviceName,
      model.userId,
      model.issuedAt,
      model.expiresAt,
    );
  }
  public static toView(model: Session): SessionViewModel {
    return new SessionViewModel(
      model.ip,
      model.deviceName,
      new Date(model.issuedAt).toISOString(),
      model._id,
    );
  }
}
