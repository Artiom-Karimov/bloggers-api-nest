import { LikeStatus } from './like.input.model';

export default class LikeDto {
  constructor(
    public id: string,
    public entityId: string,
    public userId: string,
    public userLogin: string,
    public userBanned: boolean,
    public status: LikeStatus,
    public lastModified: string,
  ) { }
}
