import { config } from 'dotenv';
config();
import * as sql from './src/config/sql';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './src/modules/users/typeorm/models/user';
import { EmailConfirmation } from './src/modules/users/typeorm/models/email.confirmation';
import { Recovery } from './src/modules/users/typeorm/models/recovery';
import { Session } from './src/modules/users/typeorm/models/session';
import { UserBan } from './src/modules/users/typeorm/models/user.ban';
import { Blog } from './src/modules/blogs/blogs/typeorm/models/blog';
import { BlogUserBan } from './src/modules/blogs/blogs/typeorm/models/blog.user.ban';
import { BlogBan } from './src/modules/blogs/blogs/typeorm/models/blog.ban';
import { Post } from './src/modules/blogs/posts/typeorm/models/post';
import { Comment } from './src/modules/blogs/comments/typeorm/models/comment';
import { PostLike } from './src/modules/blogs/likes/typeorm/models/post.like';
import { CommentLike } from './src/modules/blogs/likes/typeorm/models/comment.like';
import { Question } from './src/modules/quiz/models/question';

export default new DataSource({
  ...sql.config,
  entities: [
    User,
    EmailConfirmation,
    Recovery,
    Session,
    UserBan,

    Blog,
    BlogBan,
    BlogUserBan,
    Post,
    Comment,
    PostLike,
    CommentLike,

    Question,
  ],
  migrations: [__dirname + '/src/migrations/*.ts'],
} as DataSourceOptions);
