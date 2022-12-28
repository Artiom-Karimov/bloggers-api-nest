import { EmailConfirmation } from '../typeorm/models/email.confirmation';

export default abstract class EmailConfirmationRepository {
  public abstract getByUser(id: string): Promise<EmailConfirmation | undefined>;

  public abstract getByCode(
    code: string,
  ): Promise<EmailConfirmation | undefined>;

  public abstract create(model: EmailConfirmation): Promise<boolean>;

  public abstract update(model: EmailConfirmation): Promise<boolean>;

  public abstract delete(userId: string): Promise<boolean>;
}
