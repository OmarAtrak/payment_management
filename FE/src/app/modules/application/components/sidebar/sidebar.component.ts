import {Component, OnInit} from '@angular/core';
import {User} from 'src/app/modules/authentification/models/User';
import {AuthService} from 'src/app/modules/authentification/services/auth.service';
import {capitalizeFirstLetter} from "../../app.global";
import {Route} from 'src/app/modules/authentification/models/Route';
import {Role} from 'src/app/modules/authentification/models/Role';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: false,
})

export class SidebarComponent implements OnInit{
  currentUser:User = new User();
  capitalizeFirstLetter = capitalizeFirstLetter;
  routes:Array<Route> = [];
  public indexOfActiveMenu: number = 0;
  readonly categoryOrder = ['General', 'People', 'Programs', 'Logistics', 'Finance'];
  groupedRoutesSorted: Array<{ category: string, routes: Array<Route> }> = [];

  get currentLanguage(): string {
    let lang = localStorage.getItem("lang");
    if(!lang) {
      localStorage.setItem("lang", "fr");
      lang = "fr";
    }
    return lang;
  }

  constructor(
    private authService: AuthService,
  ) {}

  getCurrentUser() {
    this.currentUser = this.authService.getCurrentUser();
    this.routes = [];
    for (let index = 0; index < this.currentUser.roles.length; index++) {
      const role = this.currentUser.roles[index];

      this.getRoutes(role);
    }
  }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getRoutes(role:Role) {
    for (let index = 0; index < role.routes.length; index++) {
      const route = role.routes[index];

      let number = 1;
      if(route.id.toString().length == 4) {
        for (let j = 1; j < route.id.toString().length; j++) {
          number *= 10;
        }
      }
      if(route.id.toString().length == 5) {
        number = Number(route.id.toString().substring(0, 2));
        for (let j = 1; j < route.id.toString().length - 1; j++) {
          number *= 10;
        }
      }

      if(route.id % number == 0) {
        this.routes.push(route);
      }
    }
    this.routes = this.routes.filter(route => route.path != '/profile/:email');

    const grouped: { [key: string]: Route[] } = {};

    for (const route of this.routes) {
      const category = route.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(route);
    }

    // Convert to array and sort based on categoryOrder
    const groupedArray = Object.keys(grouped).map(key => ({
      category: key,
      routes: grouped[key]
    }));

    this.groupedRoutesSorted = groupedArray.sort((a, b) => {
      const indexA = this.categoryOrder.indexOf(a.category);
      const indexB = this.categoryOrder.indexOf(b.category);
      return indexA - indexB;
    });
  }
}
