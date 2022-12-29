import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import BlogsRepository from '../interfaces/blogs.repository';
import BlogModel from '../models/blog.model';
import { Blog } from './models/blog';
import BlogMapper from './models/blog.mapper';

@Injectable()
export default class SqlBlogsRepository extends BlogsRepository {
  constructor(@InjectDataSource() private readonly db: DataSource) {
    super();
  }

  public async get(id: string): Promise<BlogModel | undefined> {
    const result: Array<any> = await this.db.query(
      `
      select b."id", b."name", b."description", b."websiteUrl", b."createdAt",
      b."ownerId", bb."isBanned", bb."banDate"
      from "blog" b
      left join "blog_ban" bb
      on b."id" = bb."blogId"
      where b."id" = $1;
      `,
      [id],
    );
    if (!result || result.length === 0) return undefined;
    const blog = result[0] as Blog;
    return BlogMapper.toDomain(blog);
  }
  public async create(blog: BlogModel): Promise<string | undefined> {
    const dbBlog = BlogMapper.fromDomain(blog);
    await this.createBlog(dbBlog);
    await this.createBan(dbBlog);
    return dbBlog.id;
  }
  public async update(model: BlogModel): Promise<boolean> {
    const blog = BlogMapper.fromDomain(model);
    const dbBlog = BlogMapper.fromDomain(await this.get(blog.id));

    if (
      blog.name !== dbBlog.name ||
      blog.description !== dbBlog.description ||
      blog.websiteUrl !== dbBlog.websiteUrl
    ) {
      await this.updateBlog(blog);
    }
    if (blog.userId !== dbBlog.userId) {
      if (dbBlog.userId) await this.updateOwner(blog);
      else await this.updateOwner(blog);
    }
    if (blog.isBanned !== dbBlog.isBanned) {
      await this.updateBan(blog);
    }
    return true;
  }
  public async delete(id: string): Promise<boolean> {
    const result = await this.db.query(
      `
      delete from "blog"
      where "id" = $1;
      `,
      [id],
    );
    return !!result[1];
  }

  private async createBlog(blog: Blog) {
    await this.db.query(
      `
    insert into "blog"
    ("id","name","description","websiteUrl","createdAt","ownerId")
    values ($1,$2,$3,$4,$5,$6)
    `,
      [
        blog.id,
        blog.name,
        blog.description,
        blog.websiteUrl,
        blog.createdAt,
        blog.userId,
      ],
    );
  }

  private async createBan(blog: Blog) {
    await this.db.query(
      `
    insert into "blog_ban"
    ("blogId","isBanned","banDate")
    values ($1,$2,$3)
    `,
      [blog.id, blog.isBanned, blog.banDate],
    );
  }
  private async updateBlog(blog: Blog): Promise<boolean> {
    const result = await this.db.query(
      `
    update "blog"
    set "name" = $2, "description" = $3, "websiteUrl" = $4
    where "id" = $1
    `,
      [blog.id, blog.name, blog.description, blog.websiteUrl],
    );
    return !!result[1];
  }
  private async updateOwner(blog: Blog): Promise<boolean> {
    const result = await this.db.query(
      `
    update "blog"
    set "ownerId" = $2
    where "id" = $1
    `,
      [blog.id, blog.userId],
    );
    return !!result[1];
  }
  private async updateBan(blog: Blog): Promise<boolean> {
    const result = await this.db.query(
      `
    update "blog_ban"
    set "isBanned" = $2, "banDate" = $3
    where "blogId" = $1
    `,
      [blog.id, blog.isBanned, blog.banDate],
    );
    return !!result[1];
  }
}
