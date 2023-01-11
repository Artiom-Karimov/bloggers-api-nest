import PageQueryParams from '../../../common/models/page.query.params';
import { regex } from '../../../common/utils/validation.regex';

export class GetQuestionsQuery extends PageQueryParams {
  public bodySearchTerm: string | null = null;
  protected override sortByValues = [
    'createdAt',
    'updatedAt',
    'body',
    'published',
  ];

  constructor(query: any) {
    super(query);
    if (!query) return;
    this.assignSortBy(query.sortBy);
    this.assignBodySearchTerm(query.bodySearchTerm);
  }
  private assignBodySearchTerm(value: any) {
    if (!value || typeof value !== 'string' || !regex.questionBody.test(value))
      return;
    this.bodySearchTerm = value;
  }
}
