import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import UsersRepository from '../interfaces/users.repository';
import UserModel from '../models/user.model';
import UserMapper from './models/mappers/user.mapper';
import User from './models/user';

export default class SqlUsersRepository extends UsersRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }

  public async get(id: string): Promise<UserModel | undefined> {
    const result = await this.db.query(
      `
    select "id","login","email","hash","createdAt"
    from "user"
    where "id" = $1;
    `,
      [id],
    );
    if (!(result instanceof Array)) return undefined;
    const session = result[0] as User;
    return session ? UserMapper.toDomain(session) : undefined;
  }

  public async getByLoginOrEmail(
    value: string,
  ): Promise<UserModel | undefined> {
    const result = await this.db.query(
      `
    select "id","login","email","hash","createdAt"
    from "user"
    where "login" = $1 or "email" = $1;
    `,
      [value],
    );
    console.log(result);
    if (!(result instanceof Array)) return undefined;
    const session = result[0] as User;
    return session ? UserMapper.toDomain(session) : undefined;
  }

  public async create(user: UserModel): Promise<string | undefined> {
    const dbUser = UserMapper.fromDomain(user);
    const result = await this.db.query(
      `
      insert into "user" ("id","login","email","hash","createdAt")
      values ($1,$2,$3,$4,$5);
      `,
      [dbUser.id, dbUser.login, dbUser.email, dbUser.hash, dbUser.createdAt],
    );
    console.log(result);
    return user.id;
  }

  public async update(user: UserModel): Promise<boolean> {
    const dbUser = UserMapper.fromDomain(user);
    const result = await this.db.query(
      `
      update "user"
      set "login" = $1, "email" = $2, "hash" = $3;
      `,
      [dbUser.login, dbUser.email, dbUser.hash],
    );
    console.log(result);
    return true;
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.db.query(
      `
      delete from "user"
      where "id" = $1;
      `,
      [id],
    );
    console.log(result);
    return true;
  }
}
