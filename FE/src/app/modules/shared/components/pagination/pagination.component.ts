import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Pagination} from "../../model/pagination";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
  standalone: false,
})
export class PaginationComponent {
  @Input()
  public pagination: Pagination;
  @Output()
  public reloadData = new EventEmitter<Pagination>;

  setPage(page: number): void {
    this.pagination.currentPage = page;
    this.reloadData.emit(this.pagination);
  }

  changePageSize(value: string) {
    this.pagination.pageSize = Number(value);
    this.pagination.currentPage = 1;
    this.reloadData.emit(this.pagination);
  }
}
