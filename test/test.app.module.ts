import { ConfigModule } from '@nestjs/config';
// Leave this at the top for correct .env loading
const configModule = ConfigModule.forRoot();

import { Module } from '@nestjs/common';
import { AppController } from '../src/app.controller';
import { BlogsModule } from '../src/modules/blogs/blogs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from '../src/modules/posts/posts.module';
import { TestModule } from '../src/modules/test/test.module';
import { UsersModule } from '../src/modules/users/users.module';
import { AuthModule } from '../src/modules/auth/auth.module';
import { MailModule } from '../src/modules/mail/mail.module';
import { AppService } from '../src/app.service';
import * as config from '../src/config/database';

@Module({
  imports: [
    configModule,
    MongooseModule.forRoot(config.mongoUri),
    TestModule,
    BlogsModule,
    PostsModule,
    UsersModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class TestAppModule { }
