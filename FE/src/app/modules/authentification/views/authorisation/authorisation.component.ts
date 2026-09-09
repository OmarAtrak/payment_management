import {Component, OnInit} from '@angular/core';
import {User} from '../../models/User';
import {UserService} from '../../services/user.service';
import {Role} from '../../models/Role';
import {AuthService} from '../../services/auth.service';
import {indexOfObjectInList} from "../../../application/app.global";
import {NotificationService} from "../../../application/services/notification.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-authorisation',
  templateUrl: './authorisation.component.html',
  standalone: false,
})

export class AuthorisationComponent implements OnInit{
  users:Array<User> = [];
  isLoadingAllUser = false;
  selectedUser = new User();
  roles: Array<Role> = [];
  isLoadingAllRole = false;
  searchKey = '';
  filterUsers: Array<User> = [];

  get isLoading(): boolean {
    return this.isLoadingAllUser && this.isLoadingAllRole;
  }

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private translate: TranslateService,
  ) {}

  loadAllUsers() {
    this.users = [];
    this.isLoadingAllUser = false;

    this.userService.getAll().subscribe({
      next: response => {
        if (response) {
          response.forEach(userData => {
            const user: User = new User();
            user.fromJson(userData);
            this.users.push(user);
            this.filterUsers.push(user);
          })
          this.isLoadingAllUser = true;
        }
      },
      error: err => {
        console.error(err);
        this.notificationService.showServerErrorMessage();
      }
    });
  }

  loadAllRoles(): void {
    this.roles = [];
    this.isLoadingAllRole = false;

    this.authService.getAllRoles().subscribe({
      next: response => {
        if (response) {
          response.forEach(roleData => {
            const role: Role = new Role();
            role.fromJson(roleData);
            this.roles.push(role);
          })
          this.isLoadingAllRole = true;
        }
      },
      error: err => {
        console.error(err);
        this.notificationService.showServerErrorMessage();
      }
    });
  }

  ngOnInit() {
    this.loadAllUsers();
    this.loadAllRoles();
  }

  changeRole(role: Role) {
    const indexOfRole = indexOfObjectInList(role, this.selectedUser.roles);
    if (indexOfRole == -1) {
      this.selectedUser.roles.push(role);
    }
    else {
      this.selectedUser.roles.splice(indexOfRole, 1);
    }
  }

  updateRolesUser() {
    if (this.selectedUser.id) {
      this.authService.updateUser(this.selectedUser)
        .subscribe({
          next: response => {
            if (response) {
              (document.getElementById('close_button') as HTMLElement).click();
              this.notificationService.showMessage('success', this.translate.instant('operation.edit_success'));
            }
          },
          error: err => {
            console.error(err);
            this.notificationService.showMessage('error', this.translate.instant('operation.edit_failed'));
          }
        });
    }
  }


  isUserHasThisRole(role: Role) {
    if (this.selectedUser.id) {
      return this.selectedUser.roles.some(r => r.id == role.id);
    }
    return false;
  }


  updateSchoolsOfUser() {}


  changeStatus(user:User) {
    this.userService.changeStatus(user)
    .subscribe({
      next: response => {
        if (response) {
          user.fromJson(response);
          this.notificationService.showMessage('success', this.translate.instant('operation.edit_success'));
        }
      },
      error: err => {
        console.error(err);
        this.notificationService.showMessage('error', this.translate.instant('operation.edit_failed'));
      }
    });
  }

  isThisProfileOfUserHowIsConnected(user:User) {
    const emailConnected = this.authService.getCurrentUser().email;
    return user.email == emailConnected;
  }

  filterTable() {
    if (this.searchKey.trim() === '') {
      this.users = [...this.filterUsers];
    }
    else {
      this.users = this.filterUsers.filter(user =>
        user.fullName.toLowerCase().includes(this.searchKey.toLowerCase())
      );
    }
  }
}
