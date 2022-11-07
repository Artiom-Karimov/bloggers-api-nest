import EmailConfirmationModel from './email.confirmation.model';
import EmailConfirmation from './email.confirmation.schema';

export default class EmailConfirmationMapper {
  public static fromDomain(model: EmailConfirmationModel): EmailConfirmation {
    return new EmailConfirmation(
      model.id,
      model.confirmed,
      model.code,
      model.expiration,
    );
  }
  public static toDomain(model: EmailConfirmation): EmailConfirmationModel {
    return new EmailConfirmationModel(
      model._id,
      model.confirmed,
      model.code,
      model.expiration,
    );
  }
}
