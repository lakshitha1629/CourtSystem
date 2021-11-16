import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/core/base.component';
import { ArrestService } from 'src/app/core/service/arrest.service';
import { UserService } from 'src/app/core/service/user.service';
import { UserQuery } from 'src/app/core/state/user/user.query';
import { PasswordValidator } from './password.validator';

@Component({
  selector: 'app-viewers-registration',
  templateUrl: './viewers-registration.component.html',
  styleUrls: ['./viewers-registration.component.scss']
})
export class ViewersRegistrationComponent extends BaseComponent implements OnInit {
  userRole;
  userNICList: any = [];
  selectedNIC;
  userList;
  formGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, PasswordValidator.strong])
  });

  constructor(private router: Router, config: NgbModalConfig, private modalService: NgbModal,
    private userQuery: UserQuery,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService, private userService: UserService,
    private arrestService: ArrestService) {
    super();
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.getUserRole();
    this.getCustomerDetails();
    this.getCaseList();
  }

  onChange(newValue) {
    this.selectedNIC = newValue.nic;
  }

  getCaseList() {
    this.userService.getUserList()
      .subscribe(
        (userList) => {
          this.spinner.hide();
          this.userList = userList.filter(x => x.role == "VIEWER");
        },
        (error) => {
          console.log(error);
          this.spinner.hide();
          this.toastr.error(error.error.detail);
        }
      );
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    splitTerm.forEach(arr_term => {
      let search = item['userFullAll'].toLowerCase();
      isWordThere.push(search.indexOf(arr_term) != -1);
    });
    const all_words = (this_word) => this_word;

    return isWordThere.every(all_words);
  }

  getCustomerDetails() {
    this.arrestService.getArrest()
      .subscribe(
        (list) => {
          this.spinner.hide();
          for (let userCase of list) {
            userCase['userFull'] = userCase.firstName + ' ' + userCase.lastName;
            userCase['userFullAll'] = userCase.firstName + ' ' + userCase.lastName + ' ' + userCase.nic;
          }
          this.userNICList = list;
        },
        (error) => {
          console.log(error);
          this.spinner.hide();
          this.toastr.error(error.error.detail);
        }
      );
  }

  getUserRole() {
    const userData = this.userQuery.getAll();
    this.userRole = userData[0].role;
  }

  open(viewerContent) {
    this.modalService.open(viewerContent, { size: 'lg' });
  }

  onSubmit() {
    const userData =
    {
      username: this.selectedNIC,
      email: this.formGroup.controls.email.value,
      password: this.formGroup.controls.password.value,
      role: "VIEWER"
    }
    this.spinner.show();
    this.userService.register(userData).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        this.toastr.success('New user created!', 'Viewer Registration successful.');
        this.formGroup.reset();
        this.modalService.dismissAll();
        this.getCaseList();
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
