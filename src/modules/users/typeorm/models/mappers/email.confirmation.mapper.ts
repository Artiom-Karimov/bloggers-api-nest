import { EmailConfirmationDto } from '../../../models/dto/email.confirmation.dto';
import EmailConfirmationModel from '../../../models/email.confirmation.model';
import { EmailConfirmation } from '../email.confirmation';

export default class EmailConfirmationMapper {
  public static fromDomain(model: EmailConfirmationModel): EmailConfirmation {
    return new EmailConfirmation(model.toDto());
  }
  public static toDomain(model: EmailConfirmation): EmailConfirmationModel {
    return new EmailConfirmationModel(
      new EmailConfirmationDto(
        model.userId,
        model.confirmed,
        model.code,
        model.expiration,
      ),
    );
  }
}
