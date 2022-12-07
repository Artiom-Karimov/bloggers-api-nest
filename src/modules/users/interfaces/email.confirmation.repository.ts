import EmailConfirmationModel from '../models/email.confirmation.model';

export default abstract class EmailConfirmationRepository {
  public abstract getByUser(
    id: string,
  ): Promise<EmailConfirmationModel | undefined>;

  public abstract getByCode(
    code: string,
  ): Promise<EmailConfirmationModel | undefined>;

  public abstract create(model: EmailConfirmationModel): Promise<boolean>;

  public abstract update(model: EmailConfirmationModel): Promise<boolean>;

  public abstract delete(userId: string): Promise<boolean>;
}
