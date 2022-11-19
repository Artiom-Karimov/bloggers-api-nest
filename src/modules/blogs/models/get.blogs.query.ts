import PageQueryParams from '../../../common/models/page.query.params';

export default class GetBlogsQuery extends PageQueryParams {
  public searchNameTerm: string | null = null;

  protected override sortByValues = [
    'createdAt',
    'name',
    'description',
    'websiteUrl',
  ];

  constructor(query: any) {
    super(query);
    if (!query) return;
    this.assignSearchNameTerm(query.searchNameTerm);
    this.assignSortBy(query.sortBy);
  }
  private assignSearchNameTerm(value: any) {
    if (!value || typeof value !== 'string') return;
    this.searchNameTerm = value;
  }
}
