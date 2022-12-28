import { Repository } from 'typeorm';
import EmailConfirmationRepository from '../interfaces/email.confirmation.repository';
import EmailConfirmationModel from '../models/email.confirmation.model';
import { EmailConfirmation } from './models/email.confirmation';
import EmailConfirmationMapper from './models/mappers/email.confirmation.mapper';
import { InjectRepository } from '@nestjs/typeorm';

export class OrmEmailConfirmationRepository extends EmailConfirmationRepository {
  constructor(
    @InjectRepository(EmailConfirmation)
    private readonly repo: Repository<EmailConfirmation>,
  ) {
    super();
  }

  public async getByUser(
    id: string,
  ): Promise<EmailConfirmationModel | undefined> {
    try {
      const ec = await this.repo.findOne({ where: { userId: id } });
      if (!ec) return undefined;
      return EmailConfirmationMapper.toDomain(ec);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async getByCode(
    code: string,
  ): Promise<EmailConfirmationModel | undefined> {
    try {
      const ec = await this.repo.findOne({ where: { code } });
      if (!ec) return undefined;
      return EmailConfirmationMapper.toDomain(ec);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async create(model: EmailConfirmationModel): Promise<boolean> {
    try {
      const ec = EmailConfirmationMapper.fromDomain(model);
      const result = await this.repo.save(ec);
      return !!result.userId;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async update(model: EmailConfirmationModel): Promise<boolean> {
    return this.create(model);
  }

  public async delete(userId: string): Promise<boolean> {
    try {
      const result = await this.repo.delete(userId);
      return !!result.affected;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
