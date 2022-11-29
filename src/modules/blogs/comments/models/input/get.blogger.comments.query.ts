import PageQueryParams from '../../../../../common/models/page.query.params';

export default class GetBloggerCommentsQuery extends PageQueryParams {
  protected override sortByValues = [
    'createdAt',
    'content',
    'userId',
    'userLogin',
  ];

  constructor(query: any, public bloggerId: string) {
    super(query);
    if (!query) return;
    this.assignSortBy(query.sortBy);
  }
}
