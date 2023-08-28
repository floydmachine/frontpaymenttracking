import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  username='';

  constructor(private userService:UserService) { }

  ngOnInit() {

  }

  onSubmit() {
    this.userService.login(this.form).subscribe(
      res => {
        console.log("res",res);
        if(res.success){
          this.userService.setLoggedUser(res.data);
          this.isLoggedIn = true;
          this.isLoginFailed = false;
        }else{
          this.errorMessage = res.error;
          this.isLoginFailed = true;
        }  
          },
      error => {
        this.errorMessage = error.error.message;
        this.isLoginFailed = true;
      }
      
  );
  
    }

  reloadPage() {
    window.location.reload();
  }
}