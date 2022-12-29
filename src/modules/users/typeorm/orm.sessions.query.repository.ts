import { InjectRepository } from '@nestjs/typeorm';
import SessionsQueryRepository from '../interfaces/sessions.query.repository';
import SessionViewModel from '../models/view/session.view.model';
import { Session } from './models/session';
import { Repository } from 'typeorm';
import SessionMapper from './models/mappers/session.mapper';

export class OrmSessionsQueryRepository extends SessionsQueryRepository {
  constructor(
    @InjectRepository(Session)
    private readonly repo: Repository<Session>,
  ) {
    super();
  }

  public async get(userId: string): Promise<SessionViewModel[]> {
    try {
      const sessions = await this.repo.find({ where: { userId } });
      return sessions.map((s) => SessionMapper.toView(s));
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
