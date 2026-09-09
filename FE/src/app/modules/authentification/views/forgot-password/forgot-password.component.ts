import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {User} from '../../models/User';
import {AuthService} from '../../services/auth.service';
import {NotificationService} from "../../../application/services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  standalone: false,
})

export class ForgotPasswordComponent {
  form: FormGroup;

  get isRtl(): boolean {
    return this.translate.currentLang === 'ar';
  }

  constructor(
    public formBuilder:FormBuilder,
    public router:Router,
    private userService:UserService,
    private authService:AuthService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<ForgotPasswordComponent>,
  ) {
    if (this.router.url == '/login') {
      this.form = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]]
      });
    }
    else if (this.router.url == '/profile') {
      this.form = this.formBuilder.group({
        oldPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]]
      });
    }
  }

  async resetPassword() {
    if(this.form.valid) {
      if(this.router.url == '/login') {
        const email = this.form.controls['email'].value;
        await this.userService.sendToken(email)
        .subscribe((response) => {
          this.closeDialog();
          this.router.navigate(['check-token/'+email]);
        });
      }
      else if(this.router.url == '/profile') {
        let user:User = this.authService.getCurrentUser();
        const oldPassword = this.form.controls['oldPassword'].value;
        const newPassword = this.form.controls['newPassword'].value;

        this.userService.changePassword(user.email, oldPassword, newPassword)
          .subscribe((response) => {
            if (response == 'Change password valid' || response == 'message.change_password.valid'){
              this.closeDialog();
              this.notificationService.showMessage('success', this.translate.instant('operation.edit_success'));
            }
          });
      }
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
