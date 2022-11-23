import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import UserBanMapper from '../users/models/ban/user.ban.mapper';
import UserBan, { UserBanDocument } from '../users/models/ban/user.ban.schema';
import UserBanViewModel from '../users/models/ban/user.ban.view.model';

Injectable();
export default class UsersBanQueryRepository {
  constructor(
    @InjectModel(UserBan.name) private readonly model: Model<UserBanDocument>,
  ) { }

  public async get(id: string): Promise<UserBanViewModel | undefined> {
    try {
      const result = await this.model.findById(id);
      return result ? UserBanMapper.toView(result) : undefined;
    } catch (error) {
      console.error(error);
    }
  }
}
