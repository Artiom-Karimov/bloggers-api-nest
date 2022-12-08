import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import EmailConfirmationRepository from '../interfaces/email.confirmation.repository';
import EmailConfirmationModel from '../models/email.confirmation.model';
import EmailConfirmation from './models/email.confirmation';
import EmailConfirmationMapper from './models/mappers/email.confirmation.mapper';

@Injectable()
export default class SqlEmailConfirmationRepository extends EmailConfirmationRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }

  public async getByUser(
    id: string,
  ): Promise<EmailConfirmationModel | undefined> {
    const result = await this.db.query(
      `
    select "userId","confirmed","code","expiration"
    from "emailConfirmation"
    where "userId" = $1;
    `,
      [id],
    );
    if (!(result instanceof Array)) return undefined;
    const ec = result[0] as EmailConfirmation;
    return ec ? EmailConfirmationMapper.toDomain(ec) : undefined;
  }

  public async getByCode(
    code: string,
  ): Promise<EmailConfirmationModel | undefined> {
    const result = await this.db.query(
      `
    select "userId","confirmed","code","expiration"
    from "emailConfirmation"
    where "code" = $1;
    `,
      [code],
    );
    if (!(result instanceof Array)) return undefined;
    const ec = result[0] as EmailConfirmation;
    return ec ? EmailConfirmationMapper.toDomain(ec) : undefined;
  }

  public async create(model: EmailConfirmationModel): Promise<boolean> {
    const dbConfirmation = EmailConfirmationMapper.fromDomain(model);
    await this.db.query(
      `
      insert into "emailConfirmation" ("userId","confirmed","code","expiration")
      values ($1,$2,$3,$4);
      `,
      [
        dbConfirmation.userId,
        dbConfirmation.confirmed,
        dbConfirmation.code,
        dbConfirmation.expiration,
      ],
    );
    return true;
  }

  public async update(model: EmailConfirmationModel): Promise<boolean> {
    const dbConfirmation = EmailConfirmationMapper.fromDomain(model);
    const result = await this.db.query(
      `
      update "emailConfirmation"
      set "confirmed" = $2, "code" = $3, "expiration" = $4
      where "userId" = $1;
      `,
      [
        dbConfirmation.userId,
        dbConfirmation.confirmed,
        dbConfirmation.code,
        dbConfirmation.expiration,
      ],
    );
    return !!result[1];
  }

  public async delete(userId: string): Promise<boolean> {
    const result = await this.db.query(
      `
      delete from "emailConfirmation"
      where "userId" = $1;
      `,
      [userId],
    );
    return !!result[1];
  }
}
