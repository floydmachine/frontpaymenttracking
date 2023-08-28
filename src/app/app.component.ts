import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontpaymenttracking';
  isLoggedIn = false;
  username!: string;
  constructor(private userService:UserService) { }
  ngOnInit(): void {

    this.isLoggedIn = !!this.userService.getLoggedUser();

    if (this.isLoggedIn) {
      const user = this.userService.getUserFromStorage();
      this.username = user.username;
    }
  }


  logout() {
    this.userService.logout();
    window.location.reload();
  }

}
