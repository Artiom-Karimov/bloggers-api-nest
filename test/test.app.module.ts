import { ConfigModule } from '@nestjs/config';
// Leave this at the top for correct .env loading
const configModule = ConfigModule.forRoot();

import { Module } from '@nestjs/common';
import { AppController } from '../src/app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from '../src/modules/blogs/blogs.module';
import { TestModule } from '../src/modules/test/test.module';
import { AuthModule } from '../src/modules/auth/auth.module';
import { AppService } from '../src/app.service';
import * as mongo from '../src/config/mongo';
import * as sql from '../src/config/sql';
import { BloggerModule } from '../src/modules/blogger/blogger.module';
import { AdminModule } from '../src/modules/admin/admin.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MailService } from '../src/modules/mail/mail.service';
import { MailServiceMock } from './utils/mail.service.mock';

@Module({
  imports: [
    configModule,
    MongooseModule.forRoot(mongo.mongoUri),
    TypeOrmModule.forRoot(sql.config as TypeOrmModuleOptions),
    TestModule,
    BlogsModule,
    AuthModule,
    BloggerModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: MailService,
      useClass: MailServiceMock,
    },
  ],
  exports: [MailService],
})
export class TestAppModule { }
