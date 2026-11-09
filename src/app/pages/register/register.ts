import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

const passwordsMatchValidator: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return typeof password === 'string' &&
    typeof confirmPassword === 'string' &&
    password !== confirmPassword &&
    password.length > 0 &&
    confirmPassword.length > 0
    ? { passwordMismatch: true }
    : null;
};

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
  }, { validators: passwordsMatchValidator });
  readonly submitted = signal(false);
  readonly errorMessage = signal('');

  submit() {
    this.submitted.set(true);
    this.errorMessage.set('');
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { username, email, password } = this.registerForm.getRawValue();
    this.authService.register({
      username,
      email,
      password,
      dailyCalorieGoal: 2000,
    }).subscribe({
      next: () => {
        this.router.navigateByUrl('/home');
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(error.error);
      },
    });
  }
}
