import PageQueryParams from '../../../../common/models/page.query.params';

export class GetGamesQueryParams extends PageQueryParams {
  protected override sortByValues = [
    'createdAt',
    'startedAt',
    'endedAt',
    'status',
  ];

  constructor(query: any) {
    super(query);
    this.assignSortBy(query?.sortBy);
  }
}
