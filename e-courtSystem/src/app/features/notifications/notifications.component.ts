import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/core/base.component';
import { NotificationService } from 'src/app/core/service/notification.service';
import { UserService } from 'src/app/core/service/user.service';
import { UserQuery } from 'src/app/core/state/user/user.query';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent extends BaseComponent implements OnInit {
  @ViewChild('confirmationModal')
  private modalComponent: ConfirmationModalComponent;
  modalStyle: string = 'modal-style-danger';
  modalTitle: string = 'Delete Confirmation';
  modalBody: string = 'Are you sure you want to delete All Items?';
  modalButtonColor: string = 'btn-danger';

  notificationData: any[];
  userListData: any[];
  notificationId;
  userRole;
  userEmail;

  formGroup: FormGroup = new FormGroup({
    judicialOfficer: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required])
  });

  formGroupStatus: FormGroup = new FormGroup({
    status: new FormControl('', [Validators.required])
  });

  constructor(config: NgbModalConfig, private modalService: NgbModal,
    private userQuery: UserQuery,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private notificationService: NotificationService) {
    super();
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.getUserRole();
    this.getAllNotification();
    this.getOfficerList();
  }

  getUserRole() {
    const userData = this.userQuery.getAll();
    this.userRole = userData[0].role;
    this.userEmail = userData[0].email;
  }

  getOfficerList() {
    this.spinner.show();
    const getOfficerListSubscription = this.userService.getUserList()
      .subscribe(
        (userList) => {
          this.userListData = userList.filter(x => x.role == "JUDICIAL");
          this.spinner.hide();
        },
        (error) => {
          console.log(error);
          this.spinner.hide();
          this.toastr.error(error.error.detail);
        }
      );
    this.subscriptions.push(getOfficerListSubscription);
  }

  getAllNotification() {
    this.spinner.show();
    const getAllNotificationSubscription = this.notificationService.getNotification()
      .subscribe(
        (notification) => {
          if (this.userRole == "ADMIN") {
            this.notificationData = notification;
          } else if (this.userRole == "ATTORNEY" || this.userRole == "POLICE") {
            this.notificationData = notification.filter(x => x.userFrom == this.userEmail);
          } else if (this.userRole == "JUDICIAL") {
            this.notificationData = notification.filter(x => x.userTo == this.userEmail);
          } else {
            this.notificationData = null;
          }
          this.spinner.hide();
        },
        (error) => {
          console.log(error);
          this.spinner.hide();
          this.toastr.error(error.error.detail);
        }
      );
    this.subscriptions.push(getAllNotificationSubscription);
  }

  openNotificationMessage(messageContent) {
    this.modalService.open(messageContent, { size: 'lg' });
    this.formGroup.reset();
  }

  openStatus(statusContent, id: string) {
    this.notificationId = id;
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
      this.removeNotification(id);
      console.log('Clear List');
    }
  }

  onSubmit() {
    const messageData =
    {
      userTo: this.formGroup.controls.judicialOfficer.value,
      message: this.formGroup.controls.message.value,
      Status: 1
    }
    this.spinner.show();
    this.notificationService.addNotification(messageData).subscribe({
      next: data => {
        this.spinner.hide();
        this.formGroup.reset();
        this.modalService.dismissAll();
        this.toastr.success('Successfully Added');
        this.getAllNotification();
      },
      error: error => {
        this.spinner.hide();
        console.log(error);
        this.toastr.error(error.error.detail);
      }
    });
  }

  onSubmitStatus() {
    const statusData =
    {
      id: this.notificationId,
      status: this.formGroupStatus.controls.status.value,
    }
    this.spinner.show();
    this.notificationService.updateNotificationStatus(statusData).subscribe({
      next: data => {
        this.spinner.hide();
        this.formGroup.reset();
        this.modalService.dismissAll();
        this.toastr.success('Successfully Updated Status');
        this.getAllNotification();
      },
      error: error => {
        this.spinner.hide();
        console.log(error);
        this.toastr.error(error.error.detail);
      }
    });
  }


  removeNotification(id: number) {
    this.spinner.show();
    this.notificationService.deleteNotification(id).subscribe({
      next: data => {
        this.spinner.hide();
        this.modalService.dismissAll();
        this.toastr.success('Successfully Deleted');
        this.getAllNotification();
      },
      error: error => {
        this.spinner.hide();
        console.log(error);
        this.toastr.error(error.error.detail);
      }
    });
  }
}
