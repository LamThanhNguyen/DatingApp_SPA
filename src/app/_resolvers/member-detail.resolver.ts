import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { AlertifyService } from '../_services/alertify.service';
import { UserService } from '../_services/user.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
// Class MemberDetailResolver implements Resolve để trở thành nhà cung cấp
// dữ liệu. Cụ thể ở đây là cung cấp Data về User thông id trên URL.
// Khi MemberDatilResolver trở thành class cung cấp data, nó có thể sử dụng
// route để xử lý, phân giải, giải quyết dữ liệu trong quá trình điều hướng.
// Chúng ta có method resolve() sẽ được gọi khi quá trình điều hướng bắt đầu. Với điều
// kiện là class MemberDetailResolver được gọi trong route.ts hay nói đúng hơn là nó được set trong class Router cụ thể.
// Và khi Router được kích hoạt trên URL thì nó sẽ được gọi cũng với router mà ta đã set trong route.ts
// Sau đó the Router sẽ chờ data được giải quyết trong MemberDetailResolver xong trước khi router hoàn thành.

export class MemberDetailResolver implements Resolve<User> {
  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService
    ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    // tslint:disable-next-line: no-string-literal
    return this.userService.getUser(route.params['id']).pipe(
      catchError(error => {
        this.alertify.error('Problem retrieving data');
        this.router.navigate(['/members']);
        return of(null);
      })
    );
  }
}
