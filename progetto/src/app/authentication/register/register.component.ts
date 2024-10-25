import { AuthenticationService } from './../authentication.service';
import { Component } from '@angular/core';
import { iUser } from '../../interfaces/i-user';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  formRegister: Partial<iUser> = {};

  constructor(private authSvc: AuthenticationService, private router: Router) {}

  register(form: NgForm) {
    this.formRegister = form.value;
    this.authSvc.register(this.formRegister).subscribe({
      next: (response) => {
        this.router.navigate(['/Authentication/login']);
      },
      error: (error) => {
        console.error('Errore durante la registrazione', error);
      },
      complete: () => {
        console.log('Registrazione completata con successo');
      },
    });
  }
}
