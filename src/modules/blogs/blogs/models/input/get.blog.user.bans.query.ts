import { ApiProperty } from '@nestjs/swagger';
import PageQueryParams from '../../../../../common/models/page.query.params';

export default class GetBlogUserBansQuery extends PageQueryParams {
  @ApiProperty({ required: false })
  public searchLoginTerm: string | null = null;

  protected override sortByValues = ['login', 'banDate', 'banReason'];

  constructor(query: any, public blogId: string) {
    super(query);
    if (!query) return;
    this.assignSearchLoginTerm(query.searchLoginTerm);
    this.assignSortBy(query.sortBy);
  }
  private assignSearchLoginTerm(value: any) {
    if (!value || typeof value !== 'string') return;
    this.searchLoginTerm = value;
  }
}
