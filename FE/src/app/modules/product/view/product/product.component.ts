import {Component, OnInit} from '@angular/core';
import {Product} from "../../model/product";
import {ProductService} from "../../service/product.service";
import {NotificationService} from "../../../application/services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import {Pagination} from "../../../shared/model/pagination";
import Swal from "sweetalert2";
import {capitalizeFirstLetter} from "../../../application/app.global";

@Component({
  selector: 'app-product',
  standalone: false,
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnInit {
  products: Array<Product> = [];
  isLoading: boolean = false;
  pagination: Pagination = new Pagination();
  capitalizeFirstLetter = capitalizeFirstLetter;

  constructor(
    private readonly productService: ProductService,
    private readonly notificationService: NotificationService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.products = [];
    this.isLoading = false;

    this.productService.getAll(
      this.pagination.currentPage,
      this.pagination.pageSize
    ).subscribe({
      next: (httpResponse: any) => {
        const data = httpResponse.content;

        if (data) {
          this.products = data.map((item: any) => Product.fromJson(item));
          this.pagination.totalItems = httpResponse.totalElements;
          this.isLoading = true;
        }
      },
      error: err => {
        console.error(err);
        this.notificationService.showServerErrorMessage();
      }
    });
  }

  confirmDeleteProduct(product: Product): void {
    const title = this.translate.instant('operation.confirmation.title');
    const text = this.translate.instant('operation.confirmation.product_will_be_deleted');

    // sweet alert
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      focusConfirm: false,
      focusCancel: true,
      confirmButtonText: this.translate.instant('operation.delete'),
      cancelButtonText: this.translate.instant('cancel'),
    })
      .then((result) => {
        if (result.isConfirmed) {
          // if user confirm delete
          this.productService.delete(product.id)
            .subscribe({
              next: () => {
                this.getProducts();
                Swal.fire(this.translate.instant('operation.delete_success'), this.translate.instant('operation.confirmation.product_deleted'), 'success');
              },
              error: err => {
                console.error(err);
                Swal.fire(this.translate.instant('operation.operation_failed'), '', 'error');
              }
            });
        }
        else if (result.dismiss === Swal.DismissReason.cancel) {
          // if user cancel delete
          Swal.fire(this.translate.instant('cancel'), '', 'error');
        }
      })
      .catch(error => {
        console.error(error);
        this.notificationService.showServerErrorMessage();
      });
  }

  reloadData(pagination: Pagination) {
    this.pagination = pagination;
    this.getProducts();
  }
}
