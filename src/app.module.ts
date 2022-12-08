import { ConfigModule } from '@nestjs/config';
// Leave this at the top for correct .env loading
const configModule = ConfigModule.forRoot();

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import * as mongo from './config/mongo';
import * as sql from './config/sql';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from './modules/blogs/blogs.module';
import { TestModule } from './modules/test/test.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { AppService } from './app.service';
import { BloggerModule } from './modules/blogger/blogger.module';
import { AdminModule } from './modules/admin/admin.module';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    configModule,
    MongooseModule.forRoot(mongo.mongoUri),
    TypeOrmModule.forRoot(sql.config as TypeOrmModuleOptions),
    TestModule,
    BlogsModule,
    AuthModule,
    MailModule,
    BloggerModule,
    AdminModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
