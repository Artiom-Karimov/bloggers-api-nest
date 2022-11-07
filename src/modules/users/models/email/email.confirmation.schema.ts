import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmailConfirmationDocument = EmailConfirmation & Document;

@Schema({ collection: 'email-confirmation' })
export default class EmailConfirmation {
  constructor(
    _id: string,
    confirmed: boolean,
    code: string,
    expiration: number,
  ) {
    this._id = _id;
    this.confirmed = confirmed;
    this.code = code;
    this.expiration = expiration;
  }

  @Prop()
  _id: string;

  @Prop()
  confirmed: boolean;

  @Prop()
  code: string;

  @Prop()
  expiration: number;
}

export const EmailConfirmationSchema =
  SchemaFactory.createForClass(EmailConfirmation);
