import EmailConfirmationModel from '../../../models/email.confirmation.model';
import EmailConfirmation from '../email.confirmation';

export default class EmailConfirmationMapper {
  public static fromDomain(model: EmailConfirmationModel): EmailConfirmation {
    return new EmailConfirmation(
      model.id,
      model.confirmed,
      model.code,
      new Date(model.expiration),
    );
  }
  public static toDomain(model: EmailConfirmation): EmailConfirmationModel {
    return new EmailConfirmationModel(
      model.userId,
      model.confirmed,
      model.code,
      model.expiration.getTime(),
    );
  }
}
