import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import UserMapper from './models/mappers/user.mapper';
import UserModel from '../models/user.model';
import UsersRepository from '../interfaces/users.repository';
import User, { UserDocument } from './models/user.schema';

@Injectable()
export default class MongoUsersRepository extends UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {
    super();
  }

  public async get(id: string): Promise<UserModel | undefined> {
    try {
      const result = await this.model.findOne({ _id: id });
      return result ? UserMapper.toDomain(result) : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async getByLoginOrEmail(
    value: string,
  ): Promise<UserModel | undefined> {
    try {
      const result = await this.model.findOne({
        $or: [{ login: value }, { email: value }],
      });
      return result ? UserMapper.toDomain(result) : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async create(user: UserModel): Promise<string | undefined> {
    try {
      const model = new this.model(UserMapper.fromDomain(user));
      const saved = await model.save();
      return saved ? saved._id : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async update(user: UserModel): Promise<boolean> {
    try {
      await this.model
        .findOneAndUpdate({ _id: user.id }, UserMapper.fromDomain(user))
        .exec();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  public async delete(id: string): Promise<boolean> {
    try {
      const result: User | null = await this.model.findByIdAndDelete(id).exec();
      return !!result;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
