import { Component } from '@angular/core';
import {Tax} from "../../model/tax";
import {TaxService} from "../../service/tax.service";
import {NotificationService} from "../../../../../application/services/notification.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-edit-tax',
  templateUrl: './edit-tax.component.html',
  styleUrl: './edit-tax.component.css',
  standalone: false
})
export class EditTaxComponent {
  currentTax: Tax = new Tax();
  isLoading: boolean = false;
  id: number;

  constructor(
    private readonly taxService: TaxService,
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

    // get tax by id
    this.getTax(this.id);
  }

  getTax(id: number): void {
    this.taxService.get(id)
      .subscribe({
        next: response => {
          this.currentTax = Tax.fromJson(response);
          this.isLoading = true;
        },
        error: err => {
          console.error(err);
          this.notificationService.showServerErrorMessage();
        }
      });
  }
}
