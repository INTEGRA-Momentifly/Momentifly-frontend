import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  readonly registerForm = this.formBuilder.nonNullable.group({
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern(/^[A-Za-z0-9._-]*$/),
      ],
    ],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(72),
        Validators.pattern(/^(?=.*\p{L})(?=.*\d).*$/u),
      ],
    ],
    confirmPassword: ['', Validators.required],
  });
  readonly submitted = signal(false);

  submit() {
    this.submitted.set(true);
    if (
      this.registerForm.invalid ||
      this.registerForm.value.password !== this.registerForm.value.confirmPassword
    ) {
      this.registerForm.markAllAsTouched();
      return;
    }
    // something like: this.authService.register(username, password)...
    // this.router.navigateByUrl('/home');
  }
}
