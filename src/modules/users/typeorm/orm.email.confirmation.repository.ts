import { Repository } from 'typeorm';
import EmailConfirmationRepository from '../interfaces/email.confirmation.repository';
import { EmailConfirmation } from './models/email.confirmation';
import { InjectRepository } from '@nestjs/typeorm';

export class OrmEmailConfirmationRepository extends EmailConfirmationRepository {
  constructor(
    @InjectRepository(EmailConfirmation)
    private readonly repo: Repository<EmailConfirmation>,
  ) {
    super();
  }

  public async getByUser(id: string): Promise<EmailConfirmation | undefined> {
    try {
      const ec = await this.repo.findOne({ where: { userId: id } });
      return ec ?? undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async getByCode(code: string): Promise<EmailConfirmation | undefined> {
    try {
      const ec = await this.repo.findOne({ where: { code } });
      return ec ?? undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async create(model: EmailConfirmation): Promise<boolean> {
    try {
      const result = await this.repo.save(model);
      return !!result.userId;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public async update(model: EmailConfirmation): Promise<boolean> {
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
