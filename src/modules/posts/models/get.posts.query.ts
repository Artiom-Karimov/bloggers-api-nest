import PageQueryParams from 'src/common/models/page.query.params';

export default class GetPostsQuery extends PageQueryParams {
  protected override sortByValues = [
    'createdAt',
    'title',
    'shortDescription',
    'content',
    'blogName',
  ];
  public userId: string | undefined;
  constructor(query: any, userId: string | undefined) {
    super(query);
    this.userId = userId;
    if (!query) return;
    this.assignSortBy(query.sortBy);
  }
}
