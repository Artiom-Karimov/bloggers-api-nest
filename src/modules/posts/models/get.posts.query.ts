import PageQueryParams from 'src/common/models/page.query.params';

export default class GetPostsQuery extends PageQueryParams {
  protected override sortByValues = [
    'createdAt',
    'title',
    'shortDescription',
    'content',
    'blogName',
  ];
  constructor(
    query: any,
    public blogId: string | undefined,
    public userId: string | undefined,
  ) {
    super(query);
    if (!query) return;
    this.assignSortBy(query.sortBy);
  }
}
