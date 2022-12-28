import { Session } from '../session';
import SessionViewModel from '../../../models/view/session.view.model';

export default class SessionMapper {
  public static toView(model: Session): SessionViewModel {
    return new SessionViewModel(
      model.ip,
      model.deviceName,
      model.issuedAt.toISOString(),
      model.deviceId,
    );
  }
}
