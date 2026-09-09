import {Component, OnInit} from '@angular/core';
import {Service} from "../../model/service";
import {capitalizeFirstLetter} from "../../../application/app.global";
import {WorkService} from "../../service/work.service";
import {NotificationService} from "../../../application/services/notification.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import Swal from "sweetalert2";

@Component({
  selector: 'app-details-service',
  standalone: false,
  templateUrl: './details-service.component.html',
  styleUrl: './details-service.component.css',
})
export class DetailsServiceComponent implements OnInit {
  service: Service = new Service();
  isLoading: boolean = false;
  id: number;
  capitalizeFirstLetter = capitalizeFirstLetter;

  get isRtl(): boolean {
    return this.translate.currentLang === 'ar';
  }


  constructor(
    private readonly workService: WorkService,
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

    // get service by id
    this.getService(this.id);
  }

  getService(id: number): void {
    this.workService.get(id)
      .subscribe({
        next: response => {
          this.service = Service.fromJson(response);
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
          this.workService.delete(this.service.id)
            .subscribe({
              next: () => {
                Swal.fire(this.translate.instant('operation.delete_success'), this.translate.instant('operation.confirmation.service_deleted'), 'success')
                  .then(() => {
                    this.router.navigateByUrl('/services');
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
