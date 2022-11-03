import * as config from '../../../config/users';
import IdGenerator from 'src/common/utils/id.generator';

export default class EmailConfirmationModel {
  constructor(
    public id: string,
    public userId: string,
    public confirmed: boolean,
    public code: string,
    public expiration: number,
  ) { }
  public static createNew(userId: string): EmailConfirmationModel {
    return new EmailConfirmationModel(
      IdGenerator.generate(),
      userId,
      false,
      IdGenerator.generate(),
      new Date().getTime() + config.confirmationMinutes * 60_000,
    );
  }
  public static createConfirmed(userId: string): EmailConfirmationModel {
    return new EmailConfirmationModel(
      IdGenerator.generate(),
      userId,
      true,
      '<none>',
      0,
    );
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
