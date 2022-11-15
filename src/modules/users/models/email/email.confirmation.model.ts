import IdGenerator from '../../../../common/utils/id.generator';
import * as config from '../../../../config/users';
import { add } from 'date-fns';
import { Duration } from 'date-fns';

export default class EmailConfirmationModel {
  constructor(
    public id: string,
    public confirmed: boolean,
    public code: string,
    public expiration: number,
  ) { }
  public static create(userId: string): EmailConfirmationModel {
    return new EmailConfirmationModel(
      userId,
      false,
      IdGenerator.generate(),
      add(new Date(), {
        minutes: config.confirmationMinutes,
      } as Duration).getTime(),
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
