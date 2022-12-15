import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentLike, LikeDocument } from './mongoose/models/like.schema';
import LikesRepository from './likes.repository';

@Injectable()
export default class CommentLikesRepository extends LikesRepository {
  constructor(@InjectModel(CommentLike.name) model: Model<LikeDocument>) {
    super(model);
  }
}
