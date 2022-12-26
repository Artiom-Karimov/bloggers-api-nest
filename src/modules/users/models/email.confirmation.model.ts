import IdGenerator from '../../../common/utils/id.generator';
import * as config from '../../../config/users';
import { add } from 'date-fns';
import { Duration } from 'date-fns';
import { EmailConfirmationDto } from './dto/email.confirmation.dto';

export default class EmailConfirmationModel {
  private userId: string;
  private confirmed: boolean;
  private code: string;
  private expiration: Date;

  constructor(data: EmailConfirmationDto) {
    this.userId = data.userId;
    this.confirmed = data.confirmed;
    this.code = data.code;
    this.expiration = data.expiration;
  }
  public toDto(): EmailConfirmationDto {
    return new EmailConfirmationDto(
      this.userId,
      this.confirmed,
      this.code,
      this.expiration,
    );
  }

  public static create(userId: string): EmailConfirmationModel {
    return new EmailConfirmationModel(
      new EmailConfirmationDto(
        userId,
        false,
        IdGenerator.generate(),
        add(new Date(), {
          minutes: config.confirmationMinutes,
        } as Duration),
      ),
    );
  }
  public static createConfirmed(userId: string): EmailConfirmationModel {
    return new EmailConfirmationModel(
      new EmailConfirmationDto(userId, true, '<none>', new Date(0)),
    );
  }

  public confirm() {
    if (this.isConfirmed) throw new Error('Email already confirmed');
    if (this.isExpired) throw new Error('Confirmation code expired');
    this.confirmed = true;
    this.expiration = new Date(0);
  }

  get isExpired(): boolean {
    return this.expiration < new Date();
  }
  get isConfirmed(): boolean {
    return this.confirmed;
  }
  get confirmationCode(): string {
    return this.code;
  }
}
