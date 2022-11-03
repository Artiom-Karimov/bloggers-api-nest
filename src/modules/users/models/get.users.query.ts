import PageQueryParams from 'src/common/models/page.query.params';

export default class GetUsersQuery extends PageQueryParams {
  public searchLoginTerm: string | null = null;
  public searchEmailTerm: string | null = null;

  protected override sortByValues = ['createdAt', 'login', 'email'];

  constructor(query: any) {
    super(query);
    if (!query) return;
    this.assignSearchLoginTerm(query.searchLoginTerm);
    this.assignSearchEmailTerm(query.searchEmailTerm);
    this.assignSortBy(query.sortBy);
  }
  private assignSearchLoginTerm(value: any) {
    if (!value || typeof value !== 'string') return;
    this.searchLoginTerm = value;
  }
  private assignSearchEmailTerm(value: any) {
    if (!value || typeof value !== 'string') return;
    this.searchEmailTerm = value;
  }
}
