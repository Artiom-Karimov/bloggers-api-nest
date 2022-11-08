import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecoveryDocument = Recovery & Document;

@Schema()
export default class Recovery {
  constructor(_id: string, code: string, expiresAt: number) {
    this._id = _id;
    this.code = code;
    this.expiresAt = expiresAt;
  }

  @Prop()
  _id: string;

  @Prop()
  code: string;

  @Prop()
  expiresAt: number;
}

export const RecoverySchema = SchemaFactory.createForClass(Recovery);
