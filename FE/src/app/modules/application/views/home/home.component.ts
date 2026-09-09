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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: false,
  styleUrls: ['./home.component.css'],
})

export class HomeComponent {
  currentUser:User = new User();
  summaryBalance: SummaryBalance = new SummaryBalance();
  isLoadingSummaryBalance = false;
  selectedDisplayType = 'currentWeek';

  invoices: Invoice[] = [];
  isLoadingInvoices = false;
  countInvoice = 5;

  topCustomers: TopCustomer[] = [];
  isLoadingTopCustomers = false;
  countTopCustomer = 5;

  topServices: TopService[] = [];
  isLoadingTopServices = false;
  countTopServices = 5;

  startDate: string = '';
  endDate: string = '';

  capitalizeFirstLetter = capitalizeFirstLetter;

  @ViewChild('topServicesChart')
  topServicesChartRef!: ElementRef<HTMLCanvasElement>;
  topServicesChart!: Chart;

  get isLoading(): boolean {
    return this.isLoadingSummaryBalance && this.isLoadingInvoices && this.isLoadingTopCustomers;
  }

  get isRtl(): boolean {
    return this.translate.currentLang === 'ar';
  }

  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly translate: TranslateService,
    private readonly summaryService: SummaryService,
    private readonly invoiceService: InvoiceService,
    private readonly customerService: CustomerService,
    private readonly workService: WorkService,
  ) {
    this.startDate = format(startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(), 'yyyy-MM-dd');
    this.endDate = format(endOfWeek(new Date(), { weekStartsOn: 1 }).toISOString(), 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getDetailsSummaryBalance();
    this.getLastInvoices();
    this.getTopRequestedCustomers();
    this.getTopRequestedService();
    this.renderTopServicesChart();
  }

  ngOnDestroy() {
    // if (this.chart) {
    //   this.chart.destroy();
    // }
  }

  ngAfterViewInit() {
    this.tryRenderChart();
  }

  private tryRenderChart() {
    if (this.topServices?.length && this.topServicesChartRef) {
      this.renderTopServicesChart();
    }
  }

  ngOnChanges(): void {
    this.renderTopServicesChart();
  }

  getCurrentUser() {
    this.currentUser = this.authService.getCurrentUser();
  }

  getDetailsSummaryBalance() {
    this.isLoadingSummaryBalance = false;

    this.summaryService.getBalance().subscribe({
      next: (response) => {
        this.summaryBalance = SummaryBalance.fromJson(response);
        this.isLoadingSummaryBalance = true;
      },
      error: (err) => {
        console.error(err);
        this.isLoadingSummaryBalance = true;
        this.notificationService.showServerErrorMessage();
      }
    });
  }

  getLastInvoices() {
    this.invoices = [];
    this.isLoadingInvoices = false;

    this.invoiceService.getAll(1, this.countInvoice, 'createdDate', 'desc').subscribe({
      next: (httpResponse: any) => {
        const data = httpResponse.content;

        if (data) {
          this.invoices = data.map((item: any) => Invoice.fromJson(item));
          this.isLoadingInvoices = true;
        }
      },
      error: err => {
        console.error(err);
        this.notificationService.showServerErrorMessage();
      }
    });
  }

  getTopRequestedCustomers() {
    this.topCustomers = [];
    this.isLoadingTopCustomers = false;

    this.customerService.getTopRequestedCustomers(1, this.countTopCustomer)
      .subscribe({
        next: (httpResponse: any) => {
          const data = httpResponse.content;

          if (data) {
            this.topCustomers = data.map((item: any) => TopCustomer.fromJson(item));
            this.isLoadingTopCustomers = true;
          }
        },
        error: (err) => {
          console.error(err);
          this.notificationService.showServerErrorMessage();
        }
      });
  }

  getTopRequestedService() {
    this.topServices = [];
    this.isLoadingTopServices = false;

    this.workService.getTopRequested(1, this.countTopServices)
      .subscribe({
        next: (httpResponse: any) => {
          const data = httpResponse.content;

          if (data) {
            this.topServices = data.map((item: any) => TopService.fromJson(item));
            this.isLoadingTopServices = true;
            this.renderTopServicesChart();
          }
        },
        error: (err) => {
          console.error(err);
          this.notificationService.showServerErrorMessage();
        }
      });
  }

  filterByPeriod() {
    this.isLoadingSummaryBalance = false;
    this.summaryService.getBalanceByPeriod(this.startDate, this.endDate)
      .subscribe({
        next: (response) => {
          this.summaryBalance = SummaryBalance.fromJson(response);
          this.isLoadingSummaryBalance = true;
        },
        error: (err) => {
          console.error(err);
          this.isLoadingSummaryBalance = true;
          this.notificationService.showServerErrorMessage();
        }
      });
  }

  setPeriod(period: string) {
    const today = new Date();
    let start: Date, end: Date;

    switch (period) {
      case 'term1': {
        const startDay = format(new Date(), 'yyyy-01-01');
        const endDay = format(new Date(), 'yyyy-03-31');
        start = new Date(startDay);
        end = new Date(endDay);
        break;
      }
      case 'term2': {
        const startDay = format(new Date(), 'yyyy-04-01');
        const endDay = format(new Date(), 'yyyy-06-30');
        start = new Date(startDay);
        end = new Date(endDay);
        break;
      }
      case 'term3': {
        const startDay = format(new Date(), 'yyyy-07-01');
        const endDay = format(new Date(), 'yyyy-09-30');
        start = new Date(startDay);
        end = new Date(endDay);
        break;
      }
      case 'term4': {
        const startDay = format(new Date(), 'yyyy-10-01');
        const endDay = format(new Date(), 'yyyy-12-31');
        start = new Date(startDay);
        end = new Date(endDay);
        break;
      }
      case 'currentWeek': {
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        start = new Date(today.setDate(diff));
        end = new Date();
        break;
      }
      case 'previousWeek': {
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1) - 7;
        start = new Date(today.setDate(diff));
        end = new Date(today.setDate(today.getDate() + 6));
        break;
      }
      case 'currentMonth': {
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      }
      case 'previousMonth': {
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      }
      default:
        start = new Date();
        end = new Date();
    }
    this.startDate = format(start, 'yyyy-MM-dd');
    this.endDate = format(end, 'yyyy-MM-dd');
    this.filterByPeriod();
  }

  changeDisplayType(type: string) {
    this.selectedDisplayType = type;
    this.setPeriod(type);
  }

  private renderTopServicesChart(): void {
    if (!this.topServicesChartRef) return;

    const ctx = this.topServicesChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Destroy old chart
    if (this.topServicesChart) {
      this.topServicesChart.destroy();
    }

    const labels = this.topServices.map(s => s.name);
    const data = this.topServices.map(s => s.totalRequests);

    const backgroundColors = [
      '#36A2EB',
      '#FF6384',
      '#FFCE56',
      '#4BC0C0',
      '#9966FF',
      '#FF9F40'
    ];

    this.topServicesChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          label: this.translate.instant('number-of-operations'),
          data,
          backgroundColor: backgroundColors.slice(0, data.length),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true, // better UX for doughnut
            position: 'bottom'
          },
          title: {
            display: true,
            text: this.translate.instant('most-requested-services')
          }
        }
      }
    });
  }
}
