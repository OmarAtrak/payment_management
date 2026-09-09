import {Component, OnInit} from '@angular/core';
import {Service} from "../../model/service";
import {Pagination} from "../../../shared/model/pagination";
import {capitalizeFirstLetter} from "../../../application/app.global";
import {WorkService} from "../../service/work.service";
import {NotificationService} from "../../../application/services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import Swal from "sweetalert2";

@Component({
  selector: 'app-service',
  standalone: false,
  templateUrl: './service.component.html',
  styleUrl: './service.component.css',
})
export class ServiceComponent implements OnInit{
  services: Array<Service> = [];
  isLoading: boolean = false;
  pagination: Pagination = new Pagination();
  capitalizeFirstLetter = capitalizeFirstLetter;

  constructor(
    private readonly workService: WorkService,
    private readonly notificationService: NotificationService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.getServices();
  }

  getServices(): void {
    this.services = [];
    this.isLoading = false;

    this.workService.getAll(
      this.pagination.currentPage,
      this.pagination.pageSize
    ).subscribe({
      next: (httpResponse: any) => {
        const data = httpResponse.content;

        if (data) {
          this.services = data.map((item: any) => Service.fromJson(item));
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

  confirmDeleteService(service: Service): void {
    const title = this.translate.instant('operation.confirmation.title');
    const text = this.translate.instant('operation.confirmation.service_will_be_deleted');

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
          this.workService.delete(service.id)
            .subscribe({
              next: () => {
                this.getServices();
                Swal.fire(this.translate.instant('operation.delete_success'), this.translate.instant('operation.confirmation.service_deleted'), 'success');
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
    this.getServices();
  }
}
