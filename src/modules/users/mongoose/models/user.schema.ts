import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ collection: 'users' })
export default class User {
  constructor(
    _id: string,
    login: string,
    email: string,
    passwordHash: string,
    createdAt: string,
  ) {
    this._id = _id;
    this.login = login;
    this.email = email;
    this.passwordHash = passwordHash;
    this.createdAt = createdAt;
  }
  @Prop()
  _id: string;

  @Prop()
  login: string;

  @Prop()
  email: string;

  @Prop()
  passwordHash: string;

  @Prop()
  createdAt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
