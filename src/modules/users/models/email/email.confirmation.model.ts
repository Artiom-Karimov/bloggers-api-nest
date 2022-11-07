import IdGenerator from '../../../../common/utils/id.generator';
import * as config from '../../../../config/users';

export default class EmailConfirmationModel {
  constructor(
    public id: string,
    public confirmed: boolean,
    public code: string,
    public expiration: number,
  ) { }
  public static createNew(userId: string): EmailConfirmationModel {
    return new EmailConfirmationModel(
      userId,
      false,
      IdGenerator.generate(),
      new Date().getTime() + config.confirmationMinutes * 60_000,
    );
  }
  public static createConfirmed(userId: string): EmailConfirmationModel {
    return new EmailConfirmationModel(userId, true, '<none>', 0);
  }
  public static setConfirmed(
    model: EmailConfirmationModel,
  ): EmailConfirmationModel {
    model.confirmed = true;
    model.code = '<none>';
    model.expiration = 0;
    return model;
  }
}
