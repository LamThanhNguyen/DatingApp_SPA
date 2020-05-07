import {Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { ListResolver } from './_resolvers/list.resolver';
import { MessagesResolver } from './_resolvers/messages.resolver';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';

export const appRoutes: Routes = [
  // tslint:disable-next-line: max-line-length
  { path: 'home', component: HomeComponent},  // Đường dẫn trống chính là Home Component, kể cả /home bởi vì chúng ta có set một trường hợp ở dưới cùng route này
  {
    path: '', // Bắt đầu là đường dẫn trống, từ đường dẫn trống
    runGuardsAndResolvers: 'always',  // Luôn luôn kiểm tra mỗi khi reload hay load URL
    // tslint:disable-next-line: max-line-length
    canActivate: [AuthGuard],   // Kiểm tra canActivate của class AuthGuard nếu đã login thì trả về true còn không thì false cùng message và redirect to Home
    children: [
      {path: 'members', component: MemberListComponent,
          resolve: {users: MemberListResolver}},
      {path: 'members/:id', component: MemberDetailComponent,
          resolve: {user: MemberDetailResolver}},
         // Dòng lệnh ngay phía trên : resolve sẽ tra cứu và tìm kiếm method resolve sau đó
         // thực hiện method resolve nằm trong class mà nó tìm kiếm được
         // Biến user có kiểu <User>
         // (do được khai báo là giá trị trả về sẽ hứng giá trị trả về của class MemberDetailComponent implement Resolves<User>)
         // Sau đó nó sẽ truyền biến user này cùng với data mà nó đang chứa
         // về cho ngOnit() { this.route.data.subscribe(data => {this.user = data['user'];});} để xử lý và lọc ra data để load lên View.
      {path: 'member/edit', component: MemberEditComponent,
          resolve: {user: MemberEditResolver},
          canDeactivate: [PreventUnsavedChanges]},
      {path: 'messages', component: MessagesComponent, resolve: {messages: MessagesResolver}},
      {path: 'lists', component: ListsComponent, resolve: {users: ListResolver}},
      {path: 'admin', component: AdminPanelComponent, data: {roles: ['Admin', 'Moderator']}},
    ]
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full'},
  // Bất cứ đường dẫn nào từ URL mà không khớp với những router mà ta đã set
  // thì nó sẽ chuyển hướng đến router empty === Home Component mà ta đã set ở trên.
];
