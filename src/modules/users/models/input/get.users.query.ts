import PageQueryParams from '../../../../common/models/page.query.params';

export enum BanStatus {
  All = 'all',
  Banned = 'banned',
  NotBanned = 'notBanned',
}

export default class GetUsersQuery extends PageQueryParams {
  public searchLoginTerm: string | null = null;
  public searchEmailTerm: string | null = null;
  public banStatus: BanStatus = BanStatus.All;

  protected readonly loginRegexp = /^[a-z0-9_-]{1,10}$/i;
  protected readonly emailRegexp = /^[\w\@\.\-]{1,100}$/i;

  protected override sortByValues = ['createdAt', 'login', 'email'];

  constructor(query: any) {
    super(query);
    if (!query) return;
    this.assignSearchLoginTerm(query.searchLoginTerm);
    this.assignSearchEmailTerm(query.searchEmailTerm);
    this.assignSortBy(query.sortBy);
    this.assignBanStatus(query.banStatus);
  }
  private assignSearchLoginTerm(value: any) {
    if (!value || typeof value !== 'string') return;
    if (!this.loginRegexp.test(value)) return;
    this.searchLoginTerm = value;
  }
  private assignSearchEmailTerm(value: any) {
    if (!value || typeof value !== 'string') return;
    if (!this.emailRegexp.test(value)) return;
    this.searchEmailTerm = value;
  }
  private assignBanStatus(value: any) {
    if (!value || typeof value !== 'string') return;
    if (Object.values(BanStatus).includes(value as BanStatus)) {
      this.banStatus = value as BanStatus;
    }
  }
}
