import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  authToken: any;
  user: any;
  isDev: boolean;

  constructor(private http: Http) {
    this.isDev = true;
  }

  registerUser(user) {
    console.log(user);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const ep = this.prepEndpoint('users/register');
    return this.http.post(ep, user, {headers: headers})
      .map(res => res.json());
  }

  authenticateUser(user) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const ep = this.prepEndpoint('users/authenticate');
    return this.http.post(ep, user, {headers: headers})
      .map(res => res.json());
  }

  getProfile() {
    const headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    const ep = this.prepEndpoint('users/profile');
    return this.http.get(ep, {headers: headers})
      .map(res => res.json());
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    return localStorage.getItem('id_token') != null;
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  prepEndpoint(ep) {
    if (!this.isDev) {
      return ep;
    } else {
      return 'http://localhost:3000/' + ep;
    }
  }

}
