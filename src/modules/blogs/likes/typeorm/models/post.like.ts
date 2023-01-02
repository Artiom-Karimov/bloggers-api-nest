import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Post } from '../../../posts/typeorm/models/post';
import { Like } from './like';
import LikeCreateModel from '../../models/like.create.model';
import { User } from '../../../../users/typeorm/models/user';
import IdGenerator from '../../../../../common/utils/id.generator';

@Entity()
export class PostLike extends Like {
  @ManyToOne(() => Post, (p) => p.likes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'entityId' })
  post: Post;

  public static create(
    data: LikeCreateModel,
    user: User,
    post: Post,
  ): PostLike {
    const like = new PostLike();
    like.id = IdGenerator.generate();
    like.entityId = data.entityId;
    like.status = data.likeStatus;
    like.lastModified = new Date();
    like.user = user;
    like.post = post;
    return like;
  }
}
