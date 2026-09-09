import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import config from 'src/config';
import {Observable} from 'rxjs';
import {User} from '../models/User';
import * as jwt from 'jwt-decode';
import {Role} from "../models/Role";

@Injectable({
    providedIn: 'root',
})


export class AuthService {
    headers = new HttpHeaders().set('Content-Type', 'application/json');

    private API_URL = config.endPoint + 'security/';

    constructor(private http: HttpClient, public router: Router) {}

    // signup
    createUser(user: User) {
      return this.http.post<User>(this.API_URL+'signup', user.toJson);
    }

    // login
    login(_username: string, _password: string): Observable<any> {
      return this.http.post<any>(this.API_URL + 'authenticate', {username:_username, password:_password});
    }

    // current user
    currentUser(): Observable<User>{
      return this.http.get<User>(this.API_URL+'current_user');
    }

    // get all roles
    getAllRoles(): Observable<Array<Role>> {
      return this.http.get<Array<Role>>(this.API_URL + 'roles');
    }

    // update user
    updateUser(user: User): Observable<User> {
      return this.http.post<User>(this.API_URL + 'update_user', user.toJson);
    }












    // get current user form local storage
    getCurrentUser() {
      const userFromLocalStorage = localStorage.getItem('user');
      const user: User = new User;
      user.fromJson(JSON.parse(userFromLocalStorage ? userFromLocalStorage : ''));
      return user;
    }

    getToken() {
      return localStorage.getItem('token');
    }

    get isLoggedIn(): boolean {
        if (!this.getToken()) {
          return false;
        }
        let authToken = this.getToken();
        let authUser = localStorage.getItem('user');
        return authToken !== null && authUser !== null;
    }

    // logout
    logout() {
        let removeToken = localStorage.removeItem('token');
        let removeUser = localStorage.removeItem('user');
        if (removeToken == null || removeUser == null) {
            this.router.navigateByUrl('/login');
        }
    }

    // get date of expiration for token
    getTokenExpirationDate() {
      try {
        const token = this.getToken();
        if(token) {
          const decodedToken: any = jwt.jwtDecode(token);

          if (!decodedToken || !decodedToken.exp) {
            return null;
          }

          const expirationDate = new Date(0);
          expirationDate.setUTCSeconds(decodedToken.exp);
          return expirationDate;
        }
        this.router.navigateByUrl('/login');
        return null;
      }
      catch (error) {
        console.error(error);
        return null;
      }
    }

    // Check if the token is expired
    public isTokenExpired(): boolean {
      const token = this.getToken();
      if (!token) {
        return true;
      }

      const expirationDate = this.getTokenExpirationDate();
      if (!expirationDate) {
        return true;
      }

      return expirationDate.getTime() < Date.now();
    }

    autoLogout():any {
      try {
        if (this.isTokenExpired()){
          this.logout();
        }
      }
      catch(error) {
        console.error(error);
      }
    }

}
