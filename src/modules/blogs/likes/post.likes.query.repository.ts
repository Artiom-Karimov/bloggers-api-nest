import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LikeDocument, PostLike } from './mongoose/models/like.schema';
import LikesQueryRepository from './likes.query.repository';

@Injectable()
export default class PostLikesQueryRepository extends LikesQueryRepository {
  constructor(@InjectModel(PostLike.name) model: Model<LikeDocument>) {
    super(model);
  }
}
