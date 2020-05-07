import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';
import { element } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: HttpClient) { }

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  // this.http.post('http://localhost:5000/api/auth/login', model)
  // model ở đây là username và password nhập vào ở dưới backend chính là đối tượng có kiểu UserForLoginDtos
  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model)
      .pipe(
        map((response: any) => {
          const user = response;
          // User ở đây sẽ bằng response mà phía Backend phản hồi lại cho phía FontEnd
          if (user) {
            localStorage.setItem('token', user.token);
            // Nếu user hợp lệ thì tạo ra cặp key/value là token và giá trị token của người dùng hiện tại.
            localStorage.setItem('user', JSON.stringify(user.user));
            this.decodedToken = this.jwtHelper.decodeToken(user.token);
            this.currentUser = user.user;
            this.changeMemberPhoto(this.currentUser.photoUrl);
          }
        })
      );
    }

    register(user: User) {
      return this.http.post(this.baseUrl + 'register', user); // this.http.post('http://localhost:5000/api/auth/register', model)
    }

    loggedIn() {
      const token = localStorage.getItem('token');
      return !this.jwtHelper.isTokenExpired(token);
    }

    roleMatch(allowedRoles): boolean {
      let isMatch = false;
      const userRoles = this.decodedToken.role as Array<string>;
      // tslint:disable-next-line: no-shadowed-variable
      allowedRoles.forEach(element => {
        if (userRoles.includes(element)) {
          isMatch = true;
          return;
        }
      });
      return isMatch;
    }
}
