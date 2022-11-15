import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsModule } from './modules/blogs/blogs.module';
import * as config from './config/database';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './modules/posts/posts.module';
import { TestModule } from './modules/test/test.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
