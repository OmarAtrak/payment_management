import {AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {User} from 'src/app/modules/authentification/models/User';
import {AuthService} from 'src/app/modules/authentification/services/auth.service';
import {capitalizeFirstLetter} from 'src/app/modules/application/app.global';
import {NotificationService} from "../../services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import {SummaryBalance} from "../../model/summary-balance";
import {SummaryService} from "../../services/summary.service";
import {endOfWeek, format, startOfWeek} from "date-fns";
import {Invoice} from "../../../invoice/model/invoice";
import {InvoiceService} from "../../../invoice/service/invoice.service";
import {TopCustomer} from "../../../customer/model/top-customer";
import {CustomerService} from "../../../customer/service/customer.service";
import {TopService} from "../../../work/model/top-service";
import {WorkService} from "../../../work/service/work.service";
import {Chart} from "chart.js";
import {ProductService} from "../../../product/service/product.service";
import {Product} from "../../../product/model/product";
import {ProductPage} from "../../../product/model/product-page";
import {Pagination} from "../../../shared/model/pagination";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: false,
  styleUrls: ['./home.component.css'],
})

export class HomeComponent {
  products: Product[] = [];
  isLoadingProducts: boolean = false;

  pagination: Pagination = new Pagination();

  capitalizeFirstLetter = capitalizeFirstLetter;

  get isLoading(): boolean {
    return this.isLoadingProducts;
  }

  constructor(
    private readonly notificationService: NotificationService,
    private readonly productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.products = [];
    this.isLoadingProducts = false;

    this.productService.getAll(this.pagination.currentPage, this.pagination.pageSize)
      .subscribe({
        next: (response: ProductPage) => {
          this.products = response.content.map((item => Product.fromJson(item)));
          this.pagination.totalItems = response.totalElements;
          this.isLoadingProducts = true;
        },
        error: (err) => {
          console.error(err);
          this.notificationService.showServerErrorMessage();
        }
      });
  }

  reloadData(pagination: Pagination): void {
    this.pagination = pagination;
    this.getProducts();
  }
}
