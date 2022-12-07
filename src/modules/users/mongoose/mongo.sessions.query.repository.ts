import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import SessionMapper from './models/mappers/session.mapper';
import Session, { SessionDocument } from './models/session.schema';
import SessionViewModel from '../models/view/session.view.model';
import SessionsQueryRepository from '../interfaces/sessions.query.repository';

@Injectable()
export default class MongoSessionsQueryRepository extends SessionsQueryRepository {
  constructor(
    @InjectModel(Session.name) private readonly model: Model<SessionDocument>,
  ) {
    super();
  }
  public async get(userId: string): Promise<SessionViewModel[]> {
    try {
      const sessions = await this.model.find({ userId }).exec();
      return sessions.map((s) => SessionMapper.toView(s));
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
