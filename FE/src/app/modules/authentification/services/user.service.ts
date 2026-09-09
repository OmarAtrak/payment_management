import { HttpClient, HttpParams } from '@angular/common/http';
import {Injectable} from '@angular/core';
import config from 'src/config';
import {Observable,} from 'rxjs';
import {User} from '../models/User';
import {File} from 'src/app/modules/shared/model/file';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private API_URL = config.endPoint+'security/';
  private attachment = File;

  constructor(private http: HttpClient) { }

  get(email:string) {
    return this.http.get(this.API_URL + 'user/' + email);
  }

  save(user:User) {
    return this.http.post<User>(this.API_URL + 'update', user.toJson);
  }

  // send token to email of user
  sendToken(email:string): Observable<any> {
    const url = `${this.API_URL}reset_password?email=${email}`;
    return this.http.post(url, {}, {responseType:'text'});
  }

  // check is token valid
  checkToken(token:string, email:string): Observable<any> {
    const url = `${this.API_URL}check_token?token=${token}&email=${email}`;
    return this.http.post(url, {}, {responseType:'text'});
  }

  // change password by token
  validateChangePassword(email:string, password:string, token:string): Observable<any> {
    const url = `${this.API_URL}validate_change_password?token=${token}&password=${password}&email=${email}`;
    return this.http.post(url, {}, {responseType:'text'});
  }

  // change password
  changePassword(email:string, oldPassword:string, newPassword:string): Observable<any> {
    const url = `${this.API_URL}change_password?oldPassword=${oldPassword}&newPassword=${newPassword}&email=${email}`;
    return this.http.post(url, {}, {responseType:'text'});
  }

  // get users
  getAll() {
    return this.http.get<Array<User>>(`${this.API_URL}user/authorisation`);
  }

  // change status of user
  changeStatus(user:User) {
    return this.http.post<User>(`${this.API_URL}user/changeStatus`, user.toJson);
  }

  // upload photo
  uploadPhoto(file:File, email:string){
    let formData = new HttpParams()
    .append('file', JSON.stringify(file.toJson))
    .append('email', email);

    return this.http.post(`${this.API_URL}user/upload_photo`, formData ,{
      headers:{ 'Content-Type': 'multipart/form-data' },
      responseType:'text'
    });
  }
}
