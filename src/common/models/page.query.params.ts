import { ApiProperty } from '@nestjs/swagger';

export default class PageQueryParams {
  @ApiProperty({ type: 'integer', required: false, default: 1 })
  public pageNumber = 1;

  @ApiProperty({ type: 'integer', required: false, default: 10 })
  public pageSize = 10;

  @ApiProperty({ type: 'string', required: false, default: 'createdAt' })
  public sortBy = 'createdAt';

  public sortOrder: 'ASC' | 'DESC' = 'DESC';

  protected sortByValues: string[] = [];

  constructor(query: any) {
    if (!query) return;
    this.assignPageNumber(query.pageNumber);
    this.assignPageSize(query.pageSize);
    this.assignSortDirection(query.sortDirection);
  }
  protected assignPageNumber(value: any) {
    const pn = this.checkNumber(value);
    if (pn) this.pageNumber = pn;
  }
  protected assignPageSize(value: any) {
    const ps = this.checkNumber(value);
    if (ps) this.pageSize = ps;
  }
  protected assignSortDirection(value: any) {
    if (!value || typeof value !== 'string') return;
    this.sortOrder = value === 'asc' ? 'ASC' : 'DESC';
  }
  protected checkNumber(value: any): number | undefined {
    if (!value) return undefined;
    if (typeof value === 'string') {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && numValue > 0) {
        return Math.floor(numValue);
      }
      return undefined;
    }
    if (typeof value === 'number' && value > 0) {
      return Math.floor(value);
    }
    return undefined;
  }
  protected assignSortBy(value: any) {
    if (!value || typeof value !== 'string') return;
    if (this.sortByValues.includes(value)) this.sortBy = value;
  }
}
