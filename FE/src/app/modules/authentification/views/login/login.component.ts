import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Route } from '../../models/Route';
import { FontAwesomeService } from 'src/plugins/font-awesome.service';
import { TranslateService } from "@ngx-translate/core";
import {NotificationService} from "../../../application/services/notification.service";
import {MatDialog} from "@angular/material/dialog";
import {ForgotPasswordComponent} from "../forgot-password/forgot-password.component";
import {RegisterComponent} from "../register/register.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false,
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword:boolean = false;

  get isRtl(): boolean {
    return this.translateService.currentLang === 'ar';
  }

  constructor(
      public fb: FormBuilder,
      public authService: AuthService,
      public router: Router,
      public fontAwesomeService:FontAwesomeService,
      private translateService: TranslateService,
      private notificationService: NotificationService,
      private dialog: MatDialog,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  async loginUser() {
    if (this.loginForm.valid) {
      await this.authService.login(this.loginForm.get('email')?.value, this.loginForm.get('password')?.value)
        .subscribe({
          next: response => {
            if (response) {
              // set jwt token in local storage
              localStorage.setItem('token', response.jwt);

              // set current user in local storage
              this.authService.currentUser()
                .subscribe((response) => {
                  if (response) {
                    for (let index = 0; index < response.roles.length; index++) {
                      response.roles[index].routes.sort((a:Route, b:Route) => {return a.position - b.position});
                    }
                    localStorage.setItem('user', JSON.stringify(response));
                    this.router.navigate(['/']);
                  }
                });
            }
          },
          error: err => {
            console.error(err);
            this.notificationService.showMessage('error', this.translateService.instant('operation.operation_failed'));
          }
        });
    }
  }

  get currentLanguage(): string {
    let lang = localStorage.getItem("lang");
    if(!lang) {
      this.translateService.use('fr');
      lang = "fr";
    }
    return lang;
  }

  openDialogForgotPassword() {
    this.dialog.open(ForgotPasswordComponent, {
      position: {top: '100px'},
      width: '50%',
      autoFocus: false,
      panelClass: 'custom-dialog-container',
    });
  }

  openDialogCreateUser() {
    this.dialog.open(RegisterComponent, {
      position: {top: '50px'},
      width: '50%',
      autoFocus: false,
      panelClass: 'custom-dialog-container',
    });
  }
}
