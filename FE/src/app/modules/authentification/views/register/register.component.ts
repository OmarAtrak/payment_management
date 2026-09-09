import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {User} from '../../models/User';
import {NotificationService} from "../../../application/services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: false,
})

export class RegisterComponent {
  signupForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<RegisterComponent>,
  ) {
    this.signupForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.minLength(10)],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }


  createUser() {
    const user:User = new User();
    user.firstName = this.signupForm.controls['firstName'].value;
    user.lastName = this.signupForm.controls['lastName'].value;
    user.email = this.signupForm.controls['email'].value;
    user.password = this.signupForm.controls['password'].value;
    if (this.signupForm.controls['phoneNumber'].value != ''){
      user.phoneNumber = this.signupForm.controls['phoneNumber'].value;
    }
    user.enabled = false;
    user.emailVerified = false;
    user.disabled = true;
    user.roles = [];

    this.authService.createUser(user)
      .subscribe({
        next: (response) => {
          if (response) {
            this.closeDialog();
            this.notificationService.showMessage('success', this.translate.instant('operation.edit_success'));
          }
        },
        error: err => {
          console.error(err);
          this.notificationService.showMessage('error', this.translate.instant('operation.operation_failed'));
        }
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
