import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';
import {NotificationService} from "../../../application/services/notification.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  standalone: false,
})

export class ResetPasswordComponent implements OnInit {
  form:FormGroup;
  email:string;
  token:string;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService,
    private translate: TranslateService,
  )
  {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      // confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    },
      // {Validators : MustMatch('password','confirmPassword')}
    );
  }

  ngOnInit(): void {
      this.activatedRoute.paramMap.subscribe((params) => {
        const email = params.get('email');
        if (email != undefined) {
          this.email = email.toString();
        }
        const token = params.get('token');
        if (token != undefined) {
          this.token = token.toString();
        }
      });
  }

  async resetPassword() {
    if (this.form.valid) {
      const password = this.form.controls['password'].value;

      await this.userService.validateChangePassword(this.email, password, this.token)
        .subscribe({
          next: response => {
            if (response == 'Token Valid'){
              this.router.navigate(['login']);
            }
          },
          error: err => {
            console.error(err);
            this.notificationService.showMessage(
              'error',
              this.translate.instant('operation.operation_failed')
            )
          }
        });
    }
  }

  // cancel reset password
  cancelResetPassword() {
    this.router.navigate(['login']);
  }

}
