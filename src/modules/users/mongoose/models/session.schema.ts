import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema({ collection: 'device-sessions' })
export default class Session {
  constructor(
    _id: string,
    deviceName: string,
    ip: string,
    userId: string,
    userLogin: string,
    issuedAt: number,
    expiresAt: number,
  ) {
    this._id = _id;
    this.deviceName = deviceName;
    this.ip = ip;
    this.userId = userId;
    this.userLogin = userLogin;
    this.issuedAt = issuedAt;
    this.expiresAt = expiresAt;
  }

  @Prop()
  _id: string;

  @Prop()
  deviceName: string;

  @Prop()
  ip: string;

  @Prop()
  userId: string;

  @Prop()
  userLogin: string;

  @Prop()
  issuedAt: number;

  @Prop()
  expiresAt: number;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
