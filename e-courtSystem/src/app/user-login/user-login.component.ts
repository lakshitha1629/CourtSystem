import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit() {
    const customerData =
    {
      email: this.formGroup.controls.email.value,
      password: this.formGroup.controls.password.value
    }
    // this.spinner.show();
    // this.customerDataService.addCustomer(customerData).subscribe({
    //   next: data => {
    //     this.spinner.hide();
    //     console.log(data);
    //     this.formGroup.reset();
    //     this.modalService.dismissAll();
    //     this.toastr.success('Successfully Added');
    //   },
    //   error: error => {
    //     console.log(error);
    //     this.toastr.error(error.error.detail);
    //     this.router.navigate(['/error-status', error.status]);
    //   }
    // });
  }

}
