import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/core/base.component';
import { ArrestService } from 'src/app/core/service/arrest.service';
import { UserQuery } from 'src/app/core/state/user/user.query';

@Component({
  selector: 'app-close-case',
  templateUrl: './close-case.component.html',
  styleUrls: ['./close-case.component.scss']
})
export class CloseCaseComponent extends BaseComponent implements OnInit {
  arrestData: any[];
  isNewItem: boolean;
  userRole;
  userGuid;

  formGroupStatus: FormGroup = new FormGroup({
    status: new FormControl('', [Validators.required])
  });

  constructor(config: NgbModalConfig, private modalService: NgbModal,
    private userQuery: UserQuery,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private arrestService: ArrestService) {
    super();
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.getArrestByStatus();
    this.getUserRole();
  }

  getUserRole() {
    const userData = this.userQuery.getAll();
    this.userRole = userData[0].role;
  }

  getArrestByStatus() {
    this.spinner.show();
    const getArrestsSubscription = this.arrestService.getArrestByStatus(3)
      .subscribe(
        (arrest) => {
          console.log(arrest);
          this.arrestData = arrest;
          this.spinner.hide();
        },
        (error) => {
          console.log(error);
          this.spinner.hide();
          this.toastr.error(error.error.detail);
        }
      );
    this.subscriptions.push(getArrestsSubscription);
  }

  openStatus(statusContent, id: string) {
    this.userGuid = id;
    this.modalService.open(statusContent, { size: 'sm' });
  }

  onSubmitStatus() {
    const statusData =
    {
      id: this.userGuid,
      status: this.formGroupStatus.controls.status.value,
    }
    this.spinner.show();
    this.arrestService.updateArrestStatus(statusData).subscribe({
      next: data => {
        this.spinner.hide();
        this.formGroupStatus.reset();
        this.modalService.dismissAll();
        this.toastr.success('Successfully Updated Status');
        this.getArrestByStatus();
      },
      error: error => {
        this.spinner.hide();
        console.log(error);
        this.toastr.error(error.error.detail);
      }
    });
  }

}

