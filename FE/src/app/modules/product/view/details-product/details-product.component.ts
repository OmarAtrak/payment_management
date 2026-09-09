import {Component, OnInit} from '@angular/core';
import {Product} from "../../model/product";
import {ProductService} from "../../service/product.service";
import {NotificationService} from "../../../application/services/notification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {capitalizeFirstLetter} from "../../../application/app.global";
import Swal from "sweetalert2";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-details-product',
  standalone: false,
  templateUrl: './details-product.component.html',
  styleUrl: './details-product.component.css',
})
export class DetailsProductComponent implements OnInit {
  product: Product = new Product();
  isLoading: boolean = false;
  id: number;
  capitalizeFirstLetter = capitalizeFirstLetter;

  get isRtl(): boolean {
    return this.translate.currentLang === 'ar';
  }

  constructor(
    private readonly productService: ProductService,
    private readonly notificationService: NotificationService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap
      .subscribe((params) => {
        const id = params.get('id');
        if (id != undefined) {
          this.id = Number(id);
        }
      });

    // get product by id
    this.getProduct(this.id);
  }

  getProduct(id: number): void {
    this.productService.get(id)
      .subscribe({
        next: response => {
          this.product = Product.fromJson(response);
          this.isLoading = true;
        },
        error: err => {
          console.error(err);
          this.notificationService.showServerErrorMessage();
        }
      });
  }

  showDialogConfirmDelete(): void {
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
          this.productService.delete(this.product.id)
            .subscribe({
              next: () => {
                Swal.fire(this.translate.instant('operation.delete_success'), this.translate.instant('operation.confirmation.product_deleted'), 'success')
                  .then(() => {
                    this.router.navigateByUrl('/products');
                  });
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
