import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import UserBanMapper from './models/ban/user.ban.mapper';
import UserBanModel from './models/ban/user.ban.model';
import UserBan, { UserBanDocument } from './models/ban/user.ban.schema';

@Injectable()
export default class UsersBanRepository {
  constructor(
    @InjectModel(UserBan.name) private readonly model: Model<UserBanDocument>,
  ) { }

  public async get(id: string): Promise<UserBanModel | undefined> {
    try {
      const result = await this.model.findById(id);
      return result ? UserBanMapper.toDomain(result) : undefined;
    } catch (error) {
      console.error(error);
    }
  }
  public async createOrUpdate(model: UserBanModel): Promise<boolean> {
    try {
      await this.model.findByIdAndDelete(model.userId);
      const newBan = new this.model(UserBanMapper.fromDomain(model));
      await newBan.save();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  public async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id);
      return result.$isDeleted();
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
