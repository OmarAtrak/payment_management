import {Component, OnInit} from '@angular/core';
import {Product} from "../../model/product";
import {ProductService} from "../../service/product.service";
import {NotificationService} from "../../../application/services/notification.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-edit-product',
  standalone: false,
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css',
})
export class EditProductComponent implements OnInit {
  currentProduct: Product = new Product();
  isLoading: boolean = false;
  id: number;

  constructor(
    private readonly productService: ProductService,
    private readonly notificationService: NotificationService,
    private readonly activatedRoute: ActivatedRoute,
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
          this.currentProduct = Product.fromJson(response);
          this.isLoading = true;
        },
        error: err => {
          console.error(err);
          this.notificationService.showServerErrorMessage();
        }
      });
  }
}
