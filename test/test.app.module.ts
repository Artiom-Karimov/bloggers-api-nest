import { ConfigModule } from '@nestjs/config';
// Leave this at the top for correct .env loading
const configModule = ConfigModule.forRoot();

import { Module } from '@nestjs/common';
import { AppController } from '../src/app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsModule } from '../src/modules/blogs/blogs.module';
import { TestModule } from '../src/modules/test/test.module';
import { AuthModule } from '../src/modules/auth/auth.module';
import { MailModule } from '../src/modules/mail/mail.module';
import { AppService } from '../src/app.service';
import * as config from '../src/config/database';
import { BloggerModule } from '../src/modules/blogger/blogger.module';
import { AdminModule } from '../src/modules/admin/admin.module';

@Module({
  imports: [
    configModule,
    MongooseModule.forRoot(config.mongoUri),
    TestModule,
    BlogsModule,
    AuthModule,
    MailModule,
    BloggerModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class TestAppModule { }
