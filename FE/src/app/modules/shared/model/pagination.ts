export class Pagination {
  constructor(
    public currentPage: number = 1,
    public pageSize: number = 15,
    public sortField: string = 'id',
    public sortDirection: string = 'asc',
    public query: string = '',
    public totalItems: number = 0,
  ) {
  }

  public pages = {left: [3, 2, 1], right: [1, 2, 3]};
  public querySearch = {
    searchKey: ''
  };

  public get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
}
