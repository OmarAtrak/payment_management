import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../model/product";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProductService} from "../../service/product.service";
import {NotificationService} from "../../../application/services/notification.service";
import {Router} from "@angular/router";
import {Category} from "../../modules/category/model/category";
import {Tax} from "../../modules/tax/model/tax";
import {Unit} from "../../modules/unit/model/unit";
import {CategoryService} from "../../modules/category/service/category.service";
import {TaxService} from "../../modules/tax/service/tax.service";
import {UnitService} from "../../modules/unit/service/unit.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-product-form',
  standalone: false,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  @Input()
  product: Product;
  form: FormGroup;
  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, false] }],
      ['link']
    ]
  };

  categories: Array<Category> = [];
  isLoadingCategories = false;
  taxes: Array<Tax> = [];
  isLoadingTaxes = false;
  units: Array<Unit> = [];
  isLoadingUnits = false;

  get isRtl(): boolean {
    return this.translateService.currentLang === 'ar';
  }


  constructor(
    private readonly productService: ProductService,
    private readonly notificationService: NotificationService,
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly categoryService: CategoryService,
    private readonly taxService: TaxService,
    private readonly unitService: UnitService,
    private readonly translateService: TranslateService,
  ) {
    this.form = this.fb.group({
      code: [null, Validators.required],
      name: [null, Validators.required],
      description: [null],
      price: [null, [Validators.required, Validators.min(0)]],
      category: [null, Validators.required],
      tax: [null, Validators.required],
      unit: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.product.id) {
      this.form.controls['code'].setValue(this.product.code);
      this.form.controls['name'].setValue(this.product.name);
      this.form.controls['description'].setValue(this.product.descriptionHtml ?? null);
      this.form.controls['price'].setValue(this.product.price ?? 0);
      this.form.controls['category'].setValue(this.product.category);
      this.form.controls['tax'].setValue(this.product.tax);
      this.form.controls['unit'].setValue(this.product.unit);
    }

    this.loadCategories();
    this.loadTaxes();
    this.loadUnits();
  }

  loadCategories(): void {
    this.categories = [];
    this.isLoadingCategories = false;

    this.categoryService.getAll().subscribe({
      next: (httpResponse: any) => {
        const data = httpResponse.content;

        if (data) {
          this.categories = data.map((item: any) => Category.fromJson(item));

          if (this.product.id) {
            this.form.controls['category'].setValue(this.product.category.id ?? null);
          }

          this.isLoadingCategories = true;
        }
      },
      error: err => {
        console.error(err);
        this.notificationService.showServerErrorMessage();
      }
    });
  }

  loadTaxes(): void {
    this.taxes = [];
    this.isLoadingTaxes = false;

    this.taxService.getAll().subscribe({
      next: (httpResponse: any) => {
        const data = httpResponse.content;

        if (data) {
          this.taxes = data.map((item: any) => Tax.fromJson(item));
          this.isLoadingTaxes = true;

          if (this.product.id) {
            this.form.controls['tax'].setValue(this.product.tax.id ?? null);
          }
        }
      },
      error: err => {
        console.error(err);
        this.notificationService.showServerErrorMessage();
      }
    });
  }

  loadUnits(): void {
    this.units = [];
    this.isLoadingUnits = false;

    this.unitService.getAll().subscribe({
      next: (httpResponse: any) => {
        const data = httpResponse.content;

        if (data) {
          this.units = data.map((item: any) => Unit.fromJson(item));
          this.isLoadingUnits = true;

          if (this.product.id) {
            this.form.controls['unit'].setValue(this.product.unit.id ?? null);
          }
        }
      },
      error: err => {
        console.error(err);
        this.notificationService.showServerErrorMessage();
      }
    });
  }

  save(): void {
    if (this.form.valid) {
      const values = this.form.value;
      this.product.code = values.code;
      this.product.name = values.name;
      this.product.descriptionHtml = values.description;
      this.product.description = values.description
        ?
          values.description
            .replace(/<\/p>/gi, '\n')
            .replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .trim()
        :
          '';
      this.product.price = values.price;

      const category = new Category();
      category.id = values.category;
      this.product.category = category;

      const tax = new Tax();
      tax.id = values.tax;
      this.product.tax = tax;

      const unit = new Unit();
      unit.id = values.unit;
      this.product.unit = unit;

      this.productService.save(this.product)
        .subscribe({
          next: (savedProduct: Product) => {
            if (savedProduct) {
              if (!this.product.id) {
                this.notificationService.saveSuccessMessage();
              }
              else {
                this.notificationService.editSuccessMessage();
              }
              this.router.navigateByUrl('/products');
            }
          },
          error: err => {
            console.error(err)
            if (!this.product.id) {
              this.notificationService.saveFailedMessage();
            }
            else {
              this.notificationService.editFailedMessage();
            }
          }
        });
    }
  }
}
