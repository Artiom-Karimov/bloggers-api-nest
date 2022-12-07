import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import SessionMapper from '../models/mappers/session.mapper';
import SessionModel from '../models/session.model';
import SessionsRepository from '../sessions.repository';
import Session, { SessionDocument } from './models/session.schema';

@Injectable()
export default class MongoSessionsRepository extends SessionsRepository {
  constructor(
    @InjectModel(Session.name) private readonly model: Model<SessionDocument>,
  ) {
    super();
  }

  public async get(deviceId: string): Promise<SessionModel | undefined> {
    try {
      const result: Session | null = await this.model.findById(deviceId).exec();
      return result ? SessionMapper.toDomain(result) : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async create(session: SessionModel): Promise<string | undefined> {
    try {
      const newSession = new this.model(SessionMapper.fromDomain(session));
      const result = await newSession.save();
      return result ? result._id : undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  public async update(session: SessionModel): Promise<boolean> {
    try {
      await this.model
        .findOneAndUpdate(
          { _id: session.deviceId },
          SessionMapper.fromDomain(session),
        )
        .exec();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  public async delete(deviceId: string): Promise<boolean> {
    try {
      const result: Session | null = await this.model
        .findByIdAndDelete(deviceId)
        .exec();
      return !!result;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  public async deleteAllButOne(
    userId: string,
    deviceId: string,
  ): Promise<number> {
    try {
      const result = await this.model.deleteMany({
        userId,
        _id: { $ne: deviceId },
      });
      return result.deletedCount;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }
  public async deleteAll(userId: string): Promise<number> {
    try {
      const result = await this.model.deleteMany({ userId });
      return result.deletedCount;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }
}
