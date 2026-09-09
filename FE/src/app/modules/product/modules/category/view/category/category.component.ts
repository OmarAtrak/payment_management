import { Component } from '@angular/core';
import {Category} from "../../model/category";
import {CategoryService} from "../../service/category.service";
import {NotificationService} from "../../../../../application/services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import Swal from "sweetalert2";
import {capitalizeFirstLetter} from "../../../../../application/app.global";

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent {
  categories: Array<Category> = [];
  isLoading: boolean = false;
  capitalizeFirstLetter = capitalizeFirstLetter;


  constructor(
    private readonly categoryService: CategoryService,
    private readonly notificationService: NotificationService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categories = [];
    this.isLoading = false;

    this.categoryService.getAll().subscribe({
      next: (httpResponse: any) => {
        const data = httpResponse.content;

        if (data) {
          this.categories = data.map((item: any) => Category.fromJson(item));
          this.isLoading = true;
        }
      },
      error: err => {
        console.error(err)
        this.notificationService.showServerErrorMessage();
      }
    });
  }

  confirmDeleteCategory(category: Category): void {
    const title = this.translate.instant('operation.confirmation.title');
    const text = this.translate.instant('operation.confirmation.product_category_will_be_deleted');

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
          this.categoryService.delete(category.id)
            .subscribe({
              next: () => {
                this.loadCategories();
                Swal.fire(this.translate.instant('operation.delete_success'), this.translate.instant('operation.confirmation.product_category_deleted'), 'success');
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
}
