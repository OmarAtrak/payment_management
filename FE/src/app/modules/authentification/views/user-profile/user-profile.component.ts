import {Component, OnInit} from '@angular/core';
import {User} from '../../models/User';
import {AuthService} from '../../services/auth.service';
import {capitalizeFirstLetter, phoneNumberFormat} from 'src/app/modules/application/app.global';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../services/user.service';
import {File} from 'src/app/modules/shared/model/file';
import {NotificationService} from "../../../application/services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import {MatDialog} from "@angular/material/dialog";
import {ForgotPasswordComponent} from "../forgot-password/forgot-password.component";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  standalone: false,
})
export class UserProfileComponent implements OnInit {
  currentUser:User = new User();
  isLoadingCurrentUser = false;
  capitalizeFirstLetter = capitalizeFirstLetter;
  phoneNumberFormat = phoneNumberFormat;
  emailUser:string;

  get isRtl(): boolean {
    return this.translateService.currentLang === 'ar';
  }

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private dialog: MatDialog,
  ) {}

  getCurrentUser() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.isLoadingCurrentUser = true;
      this.emailUser = this.currentUser.email;
    }
  }

  loadDetailUser(email:string) {
    this.userService.get(email)
      .subscribe({
        next: response => {
          if (response) {
            this.currentUser.fromJson(response);
            this.isLoadingCurrentUser = true;
          }
        },
        error: err => {
          console.error(err);
          this.notificationService.showServerErrorMessage();
        }
      });
  }

  ngOnInit(): void {
    // get value of email from route
    this.activatedRoute.paramMap.subscribe((params) => {
      const emailUser = params.get('email');
      if (emailUser != undefined) {
        this.emailUser = emailUser.toString();
      }
    });

    if(this.emailUser) {
      this.loadDetailUser(this.emailUser);
    }
    else {
      this.getCurrentUser();
    }
  }

  isThisProfileOfUserHowIsConnected() {
    const emailConnected = this.authService.getCurrentUser().email;
    return this.currentUser.email == emailConnected;
  }

  openUploadPhoto() {
    if(this.isThisProfileOfUserHowIsConnected()) {
      (document.getElementById('inputOfUpload') as HTMLElement).click();
    }
  }

  uploadPhoto(event:any) {
    const file = new File();
    file.fileName = event.target.files[0].name;
    file.fileType = event.target.files[0].type;
    file.data = '';
    file.active = true;

    this.userService.uploadPhoto(file, this.emailUser)
    .subscribe({
      next: response => {
        if (response) {

        }
      },
      error: err => {
        console.error(err);
        this.notificationService.showMessage(
          'error',
          this.translateService.instant('operation.operation_failed'),
        );
      }
    });
  }

  openForgotPasswordDialog() {
    this.dialog.open(ForgotPasswordComponent, {
      width: '500px'
    });
  }
}
