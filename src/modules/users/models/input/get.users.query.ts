import PageQueryParams from '../../../../common/models/page.query.params';
import { regex } from '../../../../common/utils/validation.regex';

export enum BanStatus {
  All = 'all',
  Banned = 'banned',
  NotBanned = 'notBanned',
}

export default class GetUsersQuery extends PageQueryParams {
  public searchLoginTerm: string | null = null;
  public searchEmailTerm: string | null = null;
  public banStatus: BanStatus = BanStatus.All;

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
    if (!regex.login.test(value)) return;
    this.searchLoginTerm = value;
  }
  private assignSearchEmailTerm(value: any) {
    if (!value || typeof value !== 'string') return;
    if (!regex.email.test(value)) return;
    this.searchEmailTerm = value;
  }
  private assignBanStatus(value: any) {
    if (!value || typeof value !== 'string') return;
    if (Object.values(BanStatus).includes(value as BanStatus)) {
      this.banStatus = value as BanStatus;
    }
  }
}
