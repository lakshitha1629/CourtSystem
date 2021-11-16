import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/core/base.component';
import { ArrestService } from 'src/app/core/service/arrest.service';
import { UserQuery } from 'src/app/core/state/user/user.query';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss']
})
export class CaseComponent extends BaseComponent implements OnInit {
  @ViewChild('confirmationModal')
  private modalComponent: ConfirmationModalComponent;
  modalStyle: string = 'modal-style-danger';
  modalTitle: string = 'Delete Confirmation';
  modalBody: string = 'Are you sure you want to delete All Items?';
  modalButtonColor: string = 'btn-danger';

  arrestData: any[];
  isNewItem: boolean;
  userRole;
  userName;
  userGuid;

  formGroup: FormGroup = new FormGroup({
    arrestId: new FormControl(''),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    NIC: new FormControl('', [Validators.required, Validators.min(10)]),
    place: new FormControl('', [Validators.required]),
    reason: new FormControl('', [Validators.required]),
    remark: new FormControl(''),
    officer: new FormControl('', [Validators.required])
  });

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
    this.getUserRole();
  }

  getUserRole() {
    const userData = this.userQuery.getAll();
    this.userRole = userData[0].role;
    this.userName = userData[0].userName;
    this.getArrestByStatus();
  }

  open(detailsContent) {
    this.modalService.open(detailsContent, { size: 'lg' });
  }

  editArrest(arrestContent, arrest, isNew: boolean) {
    this.isNewItem = isNew;
    console.log(arrest);

    this.formGroup.controls.arrestId.setValue(arrest.id);
    this.formGroup.controls.firstName.setValue(arrest.firstName);
    this.formGroup.controls.lastName.setValue(arrest.lastName);
    this.formGroup.controls.NIC.setValue(arrest.nic);
    this.formGroup.controls.place.setValue(arrest.place);
    this.formGroup.controls.reason.setValue(arrest.reason);
    this.formGroup.controls.remark.setValue(arrest.remark);
    this.formGroup.controls.officer.setValue(arrest.officer);

    this.modalService.open(arrestContent, { size: 'lg' });
  }

  getArrestByStatus() {
    this.spinner.show();
    if (this.userRole == 'VIEWER') {
      const getArrestsSubscription = this.arrestService.getArrestByStatus(2)
        .subscribe(
          (arrest) => {
            this.arrestData = arrest.filter(x => x.nic == this.userName);
            this.spinner.hide();
          },
          (error) => {
            console.log(error);
            this.spinner.hide();
            this.toastr.error(error.error.detail);
          }
        );
      this.subscriptions.push(getArrestsSubscription);
    } else {
      const getArrestsSubscription = this.arrestService.getArrestByStatus(2)
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
  }

  openArrest(arrestContent, isNew: boolean) {
    this.isNewItem = isNew;
    this.modalService.open(arrestContent, { size: 'lg' });
    this.formGroup.reset();
  }

  openStatus(statusContent, id: string) {
    this.userGuid = id;
    this.modalService.open(statusContent, { size: 'sm' });
  }

  async openModal() {
    return await this.modalComponent.open();
  }

  clearList() {
    this.openModal();
  }


  getConfirmationValue(value: any, id: number) {
    if (value == 'Save click') {
      this.removeArrest(id);
      console.log('Clear List');
    }
  }

  onSubmit() {
    if (this.isNewItem) {
      const arrestData =
      {
        FirstName: this.formGroup.controls.firstName.value,
        LastName: this.formGroup.controls.lastName.value,
        NIC: this.formGroup.controls.NIC.value,
        Place: this.formGroup.controls.place.value,
        Reason: this.formGroup.controls.reason.value,
        Remark: this.formGroup.controls.remark.value,
        Officer: this.formGroup.controls.officer.value,
        Status: 2
      }
      this.spinner.show();
      this.arrestService.addArrest(arrestData).subscribe({
        next: data => {
          this.spinner.hide();
          console.log(data);
          this.formGroup.reset();
          this.modalService.dismissAll();
          this.toastr.success('Successfully Added');
          this.getArrestByStatus();
        },
        error: error => {
          this.spinner.hide();
          console.log(error);
          this.toastr.error(error.error.detail);
        }
      });
    } else {
      const arrestData =
      {
        id: this.formGroup.controls.arrestId.value,
        firstName: this.formGroup.controls.firstName.value,
        lastName: this.formGroup.controls.lastName.value,
        nic: this.formGroup.controls.NIC.value,
        place: this.formGroup.controls.place.value,
        reason: this.formGroup.controls.reason.value,
        remark: this.formGroup.controls.remark.value,
        officer: this.formGroup.controls.officer.value
      }
      this.spinner.show();
      this.arrestService.updateArrest(arrestData).subscribe({
        next: data => {
          this.spinner.hide();
          console.log(data);
          this.formGroup.reset();
          this.modalService.dismissAll();
          this.toastr.success('Successfully Updated');
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
        console.log(data);
        this.formGroup.reset();
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

  removeArrest(id: number) {
    this.spinner.show();
    this.arrestService.deleteArrest(id).subscribe({
      next: data => {
        this.spinner.hide();
        console.log(data);
        this.modalService.dismissAll();
        this.toastr.success('Successfully Deleted');
        this.getArrestByStatus();
      },
      error: error => {
        this.spinner.hide();
        console.log(error);
        this.toastr.error(error.error.detail);
      }
    });
  }

  printPage() {
    const printContents = document.getElementById('print').innerHTML;
    const popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto,toolbar=0,scrollbars=0,status=0');
    popupWin.document.open();
    popupWin.document.write(`
        <html>
            <head>
                <title>Print Page</title>
                <!-- CSS only -->
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
                <style>

                @page {
                  size: auto;
                  margin: 0mm;
                }

                #print {
                  margin: 0;
                  padding: 0;
                  left: 0;
                  top: 0;
                  right: 0;
                  border: none;
                  overflow: hidden;
                }

                </style>
            </head>
            <body
                height: 100% !important;
                margin: 0; padding: 0;
                left: 0;
                top: 0;
                font-size: 14px !important;
                font-family: 'Helvetica';
                color: #000";
                onload="document.execCommand('print');window.close();">${printContents}</body>
        </html>`
    );
    popupWin.document.close();
    this.modalService.dismissAll();
  }

}
