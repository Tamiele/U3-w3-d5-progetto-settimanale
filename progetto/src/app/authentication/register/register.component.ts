import { AuthenticationService } from './../authentication.service';
import { Component, OnInit } from '@angular/core';
import { iUser } from '../../interfaces/i-user';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private authSvc: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(4)]],
      cognome: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  register(): void {
    if (this.registerForm.valid) {
      const formData: Partial<iUser> = this.registerForm.value;
      this.authSvc.register(formData).subscribe({
        next: () => {
          this.router.navigate(['/authentication/login']);
        },
      });
    }
  }
}
