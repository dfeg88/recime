import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private flashMessage: FlashMessagesService) {}

  canActivate(): boolean {
    return this.checkLogin();
  }

  checkLogin(): boolean {
    if (this.authService.loggedIn()) { return true; }
    this.flashMessage.show('Pease login first', {cssClass: 'bg-info text-white', timeout: 3000})
    this.router.navigate(['/login']);
    return false;
  }
}
