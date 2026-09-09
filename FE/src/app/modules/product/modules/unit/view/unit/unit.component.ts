import {Component, OnInit} from '@angular/core';
import {Unit} from "../../model/unit";
import {UnitService} from "../../service/unit.service";
import {NotificationService} from "../../../../../application/services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import Swal from "sweetalert2";

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrl: './unit.component.css',
  standalone: false
})
export class UnitComponent implements OnInit {
  units: Array<Unit> = [];
  isLoading: boolean = false;


  constructor(
    private readonly unitService: UnitService,
    private readonly notificationService: NotificationService,
    private readonly translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.loadUnits();
  }

  loadUnits(): void {
    this.units = [];
    this.isLoading = false;

    this.unitService.getAll().subscribe({
      next: (httpResponse: any) => {
        const response = httpResponse.content;

        if (response) {
          this.units = response.map((item: any) => Unit.fromJson(item));
          this.isLoading = true;
        }
      },
      error: err => {
        console.error(err);
        this.notificationService.showServerErrorMessage();
      }
    });
  }

  confirmDeleteUnit(unit: Unit): void {
    const title = this.translate.instant('operation.confirmation.title');
    const text = this.translate.instant('operation.confirmation.unit_will_be_deleted');

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
          this.unitService.delete(unit.id)
            .subscribe({
              next: () => {
                this.loadUnits();
                Swal.fire(this.translate.instant('operation.delete_success'), this.translate.instant('operation.confirmation.unit_deleted'), 'success');
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
