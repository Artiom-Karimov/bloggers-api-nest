import PageQueryParams from '../../../../../common/models/page.query.params';

export default class GetCommentsQuery extends PageQueryParams {
  protected override sortByValues = [
    'createdAt',
    'content',
    'userId',
    'userLogin',
  ];

  constructor(query: any, public postId: string, public userId: string = '') {
    super(query);
    if (!query) return;
    this.assignSortBy(query.sortBy);
  }
}
