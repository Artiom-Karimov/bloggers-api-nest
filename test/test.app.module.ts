import { ConfigModule } from '@nestjs/config';
// Leave this at the top for correct .env loading
const configModule = ConfigModule.forRoot();

import { Module } from '@nestjs/common';
import { AppController } from '../src/app.controller';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { BlogsModule } from '../src/modules/blogs/blogs.module';
import * as config from '../src/config/database';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from '../src/modules/posts/posts.module';
import { TestModule } from '../src/modules/test/test.module';
import { UsersModule } from '../src/modules/users/users.module';
import { AuthModule } from '../src/modules/auth/auth.module';
import { MailModule } from '../src/modules/mail/mail.module';
import { AppService } from '../src/app.service';

let mongoUri = config.mongoUri;
let memoryServer: MongoMemoryServer;

export const startMemoryServer = async () => {
  memoryServer = await MongoMemoryServer.create();
  mongoUri = memoryServer.getUri();
};
export const stopMemoryServer = async () => {
  await memoryServer.stop();
};

@Module({
  imports: [
    configModule,
    MongooseModule.forRoot(mongoUri),
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
