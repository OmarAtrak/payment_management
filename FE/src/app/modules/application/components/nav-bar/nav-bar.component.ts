import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { User } from 'src/app/modules/authentification/models/User';
import { AuthService } from 'src/app/modules/authentification/services/auth.service';
import { capitalizeFirstLetter } from '../../app.global';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  standalone: false,
})

export class NavBarComponent implements OnInit {
  currentUser: User = new User();
  capitalizeFirstLetter = capitalizeFirstLetter;

  constructor(
    protected readonly authService: AuthService,
    private readonly translateService: TranslateService
  ) {}

  getCurrentUser() {
    if (this.authService.isLoggedIn) {
      this.currentUser = this.authService.getCurrentUser();
    }
  }

  get currentLanguage(): string {
    let lang = localStorage.getItem("lang");
    if(!lang) {
      localStorage.setItem("lang", "fr");
      lang = "fr";
    }
    return lang;
  }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  logout() {
    this.authService.logout();
  }

  showHideUserDropdown() {
    const userDropdown = document.getElementById('userDropdown') as HTMLElement;
    if(userDropdown.classList.value.includes('d-none')) {
      userDropdown.removeAttribute("class");
      userDropdown.setAttribute("class", "d-block");
    }
    else {
      userDropdown.removeAttribute("class");
      userDropdown.setAttribute("class", "d-none");
    }
  }

  changeLanguage() {
    if(this.currentLanguage == "en") {
      this.translateService.use('ar');
      localStorage.setItem("lang", "ar");
    }
    else {
      this.translateService.use('en');
      localStorage.setItem("lang", "en");
    }
  }
}
