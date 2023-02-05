import { GetGamesQueryParams } from '../../models/input/get.games.query.params';

export class GetUserGamesQuery {
  constructor(public userId: string, public params: GetGamesQueryParams) { }
}
