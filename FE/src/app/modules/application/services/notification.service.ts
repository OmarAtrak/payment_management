import { Injectable } from '@angular/core';
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private readonly toastrService: ToastrService,
    private readonly translate: TranslateService,
  ) {}

  public showMessage(type: any, message: string, title?: string): void {
    switch (type) {
      case 'success': this.toastrService.success(message, title);
        break;
      case 'info': this.toastrService.info(message, title);
        break;
      case 'warning': this.toastrService.warning(message, title);
        break;
      default: this.toastrService.error(message, title);
        break;
    }
  }

  public saveSuccessMessage(title?: string): void {
    if (title) {
      this.toastrService.success(this.translate.instant(`operation.save_success`), this.translate.instant(title));
    }
    this.toastrService.success(this.translate.instant(`operation.save_success`));
  }
  public editSuccessMessage(title?: string): void {
    if (title) {
      this.toastrService.success(this.translate.instant(`operation.edit_success`), this.translate.instant(title));
    }
    this.toastrService.success(this.translate.instant(`operation.edit_success`));
  }

  public saveFailedMessage(title?: string): void {
    if (title) {
      this.toastrService.error(this.translate.instant(`operation.save_failed`), this.translate.instant(title));
    }
    this.toastrService.error(this.translate.instant(`operation.save_failed`));
  }
  public editFailedMessage(title?: string): void {
    if (title) {
      this.toastrService.error(this.translate.instant(`operation.edit_failed`), this.translate.instant(title));
    }
    this.toastrService.error(this.translate.instant(`operation.edit_failed`));
  }

  public showServerErrorMessage(): void {
    this.toastrService.error(this.translate.instant('server_error.message'), this.translate.instant('server_error.title'));
  }
}
