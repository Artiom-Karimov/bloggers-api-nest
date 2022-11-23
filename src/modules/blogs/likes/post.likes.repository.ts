import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LikeDocument, PostLike } from '../likes/models/like.schema';
import LikesRepository from './likes.repository';

@Injectable()
export default class PostLikesRepository extends LikesRepository {
  constructor(@InjectModel(PostLike.name) model: Model<LikeDocument>) {
    super(model);
  }
}
