import { ConfigModule } from '@nestjs/config';
// Leave this at the top for correct .env loading
const configModule = ConfigModule.forRoot();

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BlogsModule } from './modules/blogs/blogs.module';
import * as config from './config/database';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './modules/posts/posts.module';
import { TestModule } from './modules/test/test.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { AppService } from './app.service';

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
export class AppModule { }
