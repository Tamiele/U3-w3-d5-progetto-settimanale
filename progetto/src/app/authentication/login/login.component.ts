import { Component } from '@angular/core';
import { iLoginRequest } from '../../interfaces/i-login-request';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  formLogin: iLoginRequest = {
    email: '',
    password: '',
  };

  constructor(private authSvc: AuthenticationService, private router: Router) {}

  login(form: NgForm) {
    this.formLogin = form.value;
    this.authSvc.login(this.formLogin).subscribe((data) => {
      this.router.navigate(['/home']);
    });
  }
}
