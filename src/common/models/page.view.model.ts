export default class PageViewModel<TviewModel> {
  public pagesCount: number;
  public page: number;
  public pageSize: number;
  public totalCount: number;
  public items: Array<TviewModel> = [];

  constructor(page: number, pageSize: number, totalCount: number) {
    this.page = page;
    this.pageSize = pageSize;
    this.totalCount = totalCount;
    this.calcPagesCount();
  }
  public add(...models: TviewModel[]): PageViewModel<TviewModel> {
    this.items.push(...models);
    return this;
  }
  public setTotalCount(value: number): PageViewModel<TviewModel> {
    this.totalCount = value;
    this.calcPagesCount();
    return this;
  }
  public calculateSkip(): number {
    return (this.page - 1) * this.pageSize;
  }
  private calcPagesCount() {
    this.pagesCount = Math.ceil(this.totalCount / this.pageSize);
  }
}
