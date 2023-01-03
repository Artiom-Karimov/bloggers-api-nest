import { Like } from '../typeorm/models/like';

export abstract class LikesRepository<T extends Like> {
  abstract put(like: T): Promise<boolean>;
}
