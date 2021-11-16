import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../core/service/user.service';
import { PasswordValidator } from './password.validator';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent implements OnInit {
  formGroup: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, PasswordValidator.strong]),
    role: new FormControl('', [Validators.required])
  });

  constructor(private router: Router, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private userService: UserService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    const userData =
    {
      username: this.formGroup.controls.username.value,
      email: this.formGroup.controls.email.value,
      password: this.formGroup.controls.password.value,
      role: this.formGroup.controls.role.value
    }
    this.spinner.show();
    this.userService.register(userData).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        this.toastr.success('New user created!', 'Registration successful.');
        localStorage.setItem('token', data.token);
        this.formGroup.reset();
        this.router.navigateByUrl('/main');
      },
      error: error => {
        this.spinner.hide();
        console.log(error);
        this.toastr.error('Errors!', 'Uncaught Error');
        this.formGroup.reset();
      }
    });
  }

}
