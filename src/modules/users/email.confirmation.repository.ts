import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import EmailConfirmationMapper from './models/email/email.confirmation.mapper';
import EmailConfirmationModel from './models/email/email.confirmation.model';
import EmailConfirmation, {
  EmailConfirmationDocument,
} from './models/email/email.confirmation.schema';

@Injectable()
export default class EmailConfirmationRepository {
  constructor(
    @InjectModel(EmailConfirmation.name)
    private readonly model: Model<EmailConfirmationDocument>,
  ) { }

  public async getByUser(
    id: string,
  ): Promise<EmailConfirmationModel | undefined> {
    try {
      const result = await this.model.findById(id);
      return result ? EmailConfirmationMapper.toDomain(result) : undefined;
    } catch (error) {
      console.error(error);
    }
  }
  public async getByCode(
    code: string,
  ): Promise<EmailConfirmationModel | undefined> {
    try {
      const result = await this.model.findOne({ code });
      return result ? EmailConfirmationMapper.toDomain(result) : undefined;
    } catch (error) {
      console.error(error);
    }
  }
  public async create(model: EmailConfirmationModel): Promise<boolean> {
    try {
      const ec = new this.model(EmailConfirmationMapper.fromDomain(model));
      await ec.save();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  public async update(model: EmailConfirmationModel): Promise<boolean> {
    try {
      const ec = EmailConfirmationMapper.fromDomain(model);
      await this.model.findByIdAndUpdate(model.id, ec);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  public async delete(id: string): Promise<boolean> {
    try {
      await this.model.findByIdAndDelete(id);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
