import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import UserBanMapper from '../models/mappers/user.ban.mapper';
import UserBan, { UserBanDocument } from './models/user.ban.schema';
import UserBanViewModel from '../models/view/user.ban.view.model';
import UsersBanQueryRepository from '../users.ban.query.repository';

Injectable();
export default class MongoUsersBanQueryRepository extends UsersBanQueryRepository {
  constructor(
    @InjectModel(UserBan.name) private readonly model: Model<UserBanDocument>,
  ) {
    super();
  }

  public async get(id: string): Promise<UserBanViewModel | undefined> {
    try {
      const result = await this.model.findById(id);
      return result ? UserBanMapper.toView(result) : undefined;
    } catch (error) {
      console.error(error);
    }
  }
}
