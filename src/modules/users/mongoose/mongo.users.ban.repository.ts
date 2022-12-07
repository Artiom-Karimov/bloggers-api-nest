import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import UserBanMapper from './models/mappers/user.ban.mapper';
import UserBanModel from '../models/user.ban.model';
import UsersBanRepository from '../interfaces/users.ban.repository';
import UserBan, { UserBanDocument } from './models/user.ban.schema';

@Injectable()
export default class MongoUsersBanRepository extends UsersBanRepository {
  constructor(
    @InjectModel(UserBan.name) private readonly model: Model<UserBanDocument>,
  ) {
    super();
  }

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
  public async delete(userId: string): Promise<boolean> {
    try {
      await this.model.findByIdAndDelete(userId);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
