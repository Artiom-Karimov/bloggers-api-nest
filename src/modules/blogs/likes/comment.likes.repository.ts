import { Injectable } from '@nestjs/common';
import LikesRepository from './likes.repository';

@Injectable()
export default abstract class CommentLikesRepository extends LikesRepository { }
