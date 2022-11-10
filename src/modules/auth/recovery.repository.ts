import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import RecoveryMapper from './models/recovery/recovery.mapper';
import RecoveryModel from './models/recovery/recovery.model';
import Recovery, { RecoveryDocument } from './models/recovery/recovery.schema';

@Injectable()
export default class RecoveryRepository {
  constructor(
    @InjectModel(Recovery.name) private readonly model: Model<RecoveryDocument>,
  ) { }

  public async get(id: string): Promise<RecoveryModel | undefined> {
    try {
      const result = await this.model.findById(id);
      return result ? RecoveryMapper.toDomain(result) : undefined;
    } catch (error) {
      console.error(error);
    }
  }
  public async getByCode(code: string): Promise<RecoveryModel | undefined> {
    try {
      const result = await this.model.findOne({ code });
      return result ? RecoveryMapper.toDomain(result) : undefined;
    } catch (error) {
      console.error(error);
    }
  }
  public async createOrUpdate(model: RecoveryModel): Promise<boolean> {
    try {
      await this.model.findByIdAndDelete(model.userId);
      const newRecovery = new this.model(RecoveryMapper.fromDomain(model));
      await newRecovery.save();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  public async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id);
      return result.$isDeleted();
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
