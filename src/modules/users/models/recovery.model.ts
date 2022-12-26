import IdGenerator from '../../../common/utils/id.generator';
import { add } from 'date-fns';
import * as config from '../../../config/users';
import { RecoveryDto } from './dto/recovery.dto';

export default class RecoveryModel {
  private _userId: string;
  private _code: string;
  private expiration: Date;

  constructor(data: RecoveryDto) {
    this._userId = data.userId;
    this._code = data.code;
    this.expiration = data.expiration;
  }
  public toDto(): RecoveryDto {
    return new RecoveryDto(this._userId, this._code, this.expiration);
  }

  public static create(userId: string): RecoveryModel {
    return new RecoveryModel(
      new RecoveryDto(
        userId,
        IdGenerator.generate(),
        add(new Date(), { minutes: config.recoveryExpireMinutes }),
      ),
    );
  }

  get isExpired(): boolean {
    return this.expiration < new Date();
  }
  get code(): string {
    return this._code;
  }
  get userId(): string {
    return this._userId;
  }
}
