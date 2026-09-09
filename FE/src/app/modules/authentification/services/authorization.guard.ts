import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root',
})

export class AuthorizationGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    const currentPersonRoutes = this.authService.getCurrentUser().routes;
    const requestedUrl = state.url.split('?')[0];

    for (let index = 0; index < currentPersonRoutes.length; index++) {
      const routeOfPerson = currentPersonRoutes[index];
      const regexPattern = this.createRegexFromPath(routeOfPerson.path);

      if (requestedUrl.match(regexPattern)) {
        return true;
      }
    }

    this.router.navigateByUrl('/page-not-found');
    return false;
  }

  private createRegexFromPath(path: string): RegExp {
    const regexString = path.replace(/:[^\s/]+/g, '([^\\/]+)');
    return new RegExp(`^${regexString}$`);
  }
}
