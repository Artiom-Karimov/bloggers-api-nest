import PageQueryParams from '../../../../common/models/page.query.params';

export class GetGamesQueryParams extends PageQueryParams {
  protected override sortByValues = [
    'createdAt',
    'pairCreatedDate',
    'startGameDate',
    'finishGameDate',
    'status',
  ];

  constructor(query: any) {
    super(query);
    this.assignSortBy(query?.sortBy);
  }
}
