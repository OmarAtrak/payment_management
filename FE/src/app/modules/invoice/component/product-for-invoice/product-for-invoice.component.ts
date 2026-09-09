import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {Product} from "../../../product/model/product";
import {ProductService} from "../../../product/service/product.service";
import {NotificationService} from "../../../application/services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import {Invoice} from "../../model/invoice";
import {ProductItem} from "../../model/product-item";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {InvoiceService} from "../../service/invoice.service";

export interface DialogData {
  invoice: Invoice,
  productItem: ProductItem
}

@Component({
  selector: 'app-product-for-invoice',
  standalone: false,
  templateUrl: './product-for-invoice.component.html',
  styleUrl: './product-for-invoice.component.css'
})
export class ProductForInvoiceComponent implements OnInit {
  products: Array<Product> = [];
  isLoadingAllProducts: boolean = false;
  productForm: FormGroup;
  @Output()
  public reloadData = new EventEmitter<void>;

  get isRtl(): boolean {
    return this.translate.currentLang === 'ar';
  }

  constructor(
    private readonly productService: ProductService,
    private readonly notificationService: NotificationService,
    private readonly translate: TranslateService,
    private readonly dialogRef: MatDialogRef<ProductForInvoiceComponent>,
    private readonly fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private readonly invoiceService: InvoiceService,
  ) {
    this.productForm = this.fb.group({
      product: [null, Validators.required],
      price: [1, [Validators.required, Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });

    if (this.data?.productItem?.id) {
      this.productForm.controls['product'].setValue(this.data.productItem.product.id);
      this.productForm.controls['product'].disable();
      this.productForm.controls['price'].setValue(this.data.productItem.priceHT);
      this.productForm.controls['quantity'].setValue(this.data.productItem.quantity);
    }
  }

  ngOnInit() {
    this.getAllProducts();
  }

  getAllProducts(): void {
    this.products = [];
    this.isLoadingAllProducts = false;

    this.productService.getAll(1, 1000)
      .subscribe({
        next: (httpResponse: any) => {
          const data = httpResponse.content;

          if (data) {
            this.products = data.map((product: any) => Product.fromJson(product));
            this.isLoadingAllProducts = true;
          }
        },
        error: err => {
          console.error(err);
          this.notificationService.showServerErrorMessage();
        }
      });
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  submitProduct() {
    if (this.productForm.valid) {
      if (!this.data?.productItem?.id) {
        this.data.productItem = new ProductItem();
        this.data.productItem.product = this.products.find(p => p.id == this.productForm.value.product)!;
      }
      this.data.productItem.quantity = this.productForm.value.quantity;
      this.data.productItem.tax = this.data.productItem.product.tax;
      this.data.productItem.active = true;
      this.data.productItem.priceHT = this.productForm.value.price;
      this.data.productItem.priceTTC = this.data.productItem.priceHT * (1 + this.data.productItem.tax.rate);
      this.data.productItem.discount = this.data.productItem.product.price - this.data.productItem.priceHT;

      this.invoiceService.saveProductItem(this.data.invoice.id, this.data.productItem)
        .subscribe({
          next: () => {
            if (!this.data.productItem.id) {
              this.notificationService.saveSuccessMessage();
            } else {
              this.notificationService.editSuccessMessage();
            }
            this.reloadData.emit();
            this.closeModal();
          },
          error: err => {
            console.error(err);
            this.notificationService.showServerErrorMessage();
          }
        });
    }
  }

  onProductSelect(event: any): void {
    const selectedProduct = this.products.find(p => p.id == event.id);
    if (selectedProduct) {
      this.productForm.patchValue({ price: selectedProduct.price });
    }
  }
}
