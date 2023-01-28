import { ApiProperty } from '@nestjs/swagger';
import PageQueryParams from '../../../../../common/models/page.query.params';
import { regex } from '../../../../../common/utils/validation.regex';

export default class GetBlogsQuery extends PageQueryParams {
  @ApiProperty({ type: 'string', required: false })
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
    if (!value || typeof value !== 'string' || !regex.blogName.test(value))
      return;
    this.searchNameTerm = value;
  }
}
