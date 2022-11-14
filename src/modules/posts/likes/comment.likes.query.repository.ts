import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentLike, LikeDocument } from '../models/likes/like.schema';
import LikesQueryRepository from './likes.query.repository';

@Injectable()
export default class CommentLikesQueryRepository extends LikesQueryRepository {
  constructor(@InjectModel(CommentLike.name) model: Model<LikeDocument>) {
    super(model);
  }
}
