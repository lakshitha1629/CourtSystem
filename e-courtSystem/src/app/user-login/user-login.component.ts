import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../core/service/user.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  formGroup: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private router: Router, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private userService: UserService) { }

  ngOnInit(): void {
    if (localStorage.getItem('token') != null) {
      this.router.navigateByUrl('/main')
    }
  }

  onSubmit() {
    const userData =
    {
      email: this.formGroup.controls.email.value,
      password: this.formGroup.controls.password.value
    }
    this.spinner.show();
    this.userService.login(userData).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        console.log(data);
        localStorage.setItem('token', data.token);
        this.router.navigateByUrl('/main');
      },
      error: error => {
        this.spinner.hide();
        console.log(error);
        this.toastr.error(error.error.errors[0]);
        this.formGroup.reset();
      }
    });
  }

}
