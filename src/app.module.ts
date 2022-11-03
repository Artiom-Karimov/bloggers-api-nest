import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsModule } from './modules/blogs/blogs.module';
import * as config from './config/database';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './modules/posts/posts.module';
import { TestModule } from './modules/test/test.module';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongoUri),
    TestModule,
    BlogsModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
