import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserBanDocument = UserBan & Document;

@Schema({ collection: 'user-bans' })
export default class UserBan {
  constructor(
    _id: string,
    isBanned: boolean,
    banReason: string,
    banDate: string,
  ) {
    this._id = _id;
    this.isBanned = isBanned;
    this.banReason = banReason;
    this.banDate = banDate;
  }

  @Prop()
  _id: string;

  @Prop()
  isBanned: boolean;

  @Prop()
  banReason: string;

  @Prop()
  banDate: string;
}

export const UserBanSchema = SchemaFactory.createForClass(UserBan);
