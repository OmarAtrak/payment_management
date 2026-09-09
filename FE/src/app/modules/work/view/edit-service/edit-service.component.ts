import { Component } from '@angular/core';
import {NotificationService} from "../../../application/services/notification.service";
import {ActivatedRoute} from "@angular/router";
import {Service} from "../../model/service";
import {WorkService} from "../../service/work.service";

@Component({
  selector: 'app-edit-service',
  standalone: false,
  templateUrl: './edit-service.component.html',
  styleUrl: './edit-service.component.css',
})
export class EditServiceComponent {
  currentService: Service = new Service();
  isLoading: boolean = false;
  id: number;

  constructor(
    private readonly workService: WorkService,
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

    // get service by id
    this.getService(this.id);
  }

  getService(id: number): void {
    this.workService.get(id)
      .subscribe({
        next: response => {
          this.currentService = Service.fromJson(response);
          this.isLoading = true;
        },
        error: err => {
          console.error(err);
          this.notificationService.showServerErrorMessage();
        }
      });
  }
}
