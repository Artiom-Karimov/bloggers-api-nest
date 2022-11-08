import IdGenerator from '../../../../common/utils/id.generator';
import add from 'date-fns/add';
import * as config from '../../../../config/users';

export default class RecoveryModel {
  constructor(
    public userId: string,
    public code: string,
    public expiresAt: number,
  ) { }

  public static create(userId: string): RecoveryModel {
    return new RecoveryModel(
      userId,
      IdGenerator.generate(),
      add(new Date(), { minutes: config.recoveryExpireMinutes }).getTime(),
    );
  }
}
