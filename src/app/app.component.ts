import { Component } from '@angular/core';

@Component({
  selector: 'app-root', // Đây là tên bộ chọn của component này. Chúng ta có thể import component này đến các View khác bằng tag <app-root></app-root>
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DatingApp-SPA';
}
