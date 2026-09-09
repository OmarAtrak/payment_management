import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {millisecondsToTime} from 'src/app/modules/application/app.global';
import {AuthService} from 'src/app/modules/authentification/services/auth.service';
import {filter} from "rxjs";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
})

export class AppComponent implements OnInit {
  title = 'GARAGE03';
  currentUrl: string = '';
  constructor (public authService:AuthService, public router:Router, private translateService: TranslateService) {}

  ngOnInit() : void{
    if (this.authService.isLoggedIn){
      const currentDate = new Date();
      const expirationDate = this.authService.getTokenExpirationDate();
      // variable to know how much the duration for token expiration
      if (expirationDate != undefined) {
        const timeExpiration = expirationDate?.getTime() - currentDate.getTime();
        if(timeExpiration) {
          console.log('session expired in ' + millisecondsToTime(expirationDate.getTime() - currentDate.getTime()));
        }

        // Check token expiration
        setTimeout(() => {
          this.authService.autoLogout();
        }, timeExpiration);
      }
      else {
        this.authService.logout();
      }
    }
    else {
      this.router.navigate(['login']);
    }

    this.setDefaultLang();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateUrlList();
    });
  }

  updateUrlList() {
    this.currentUrl = this.router.url ?? '';
  }

  get currentLanguage(): string {
    let lang = localStorage.getItem("lang");
    if(!lang) {
      localStorage.setItem("lang", "en");
      lang = "en";
    }
    return lang;
  }

  setDefaultLang() {
    const currentLang = localStorage.getItem("lang") || 'en';
    this.translateService.setDefaultLang(currentLang);
    this.translateService.use(currentLang);
    localStorage.setItem("lang", currentLang);
  }
}
