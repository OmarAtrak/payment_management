import { Component } from '@angular/core';
import {Unit} from "../../model/unit";
import {UnitService} from "../../service/unit.service";
import {NotificationService} from "../../../../../application/services/notification.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-edit-unit',
  standalone: false,
  templateUrl: './edit-unit.component.html',
  styleUrl: './edit-unit.component.css',
})
export class EditUnitComponent {
  currentUnit: Unit = new Unit();
  isLoading: boolean = false
  id: number;

  constructor(
    private readonly unitService: UnitService,
    private readonly notificationService: NotificationService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap
      .subscribe((params) => {
        const id = params.get('id');
        if (id != undefined) {
          this.id = Number(id);
        }
      });

    // get unit by id
    this.getUnit(this.id);
  }

  getUnit(id: number): void {
    this.unitService.get(id)
      .subscribe({
        next: response => {
          this.currentUnit = Unit.fromJson(response);
          this.isLoading = true;
        },
        error: err => {
          console.error(err);
          this.notificationService.showServerErrorMessage();
        }
      });
  }
}
