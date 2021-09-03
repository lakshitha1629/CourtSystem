import { Component, EventEmitter, Injectable, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})

@Injectable()
export class ConfirmationModalComponent {
  @ViewChild('confirmationModal') private modalContent: TemplateRef<ConfirmationModalComponent>
  @Output() newConfirmationEvent = new EventEmitter<string>();
  @Input() modalStyle;
  @Input() modalTitle;
  @Input() modalBody;
  @Input() modalButtonColor: any;
  @Input() modalButtonValue;

  private modalRef: NgbModalRef

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  open(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.modalRef = this.modalService.open(this.modalContent, { size: 'sm' })
      this.modalRef.result.then((result) => {
        console.log(result);
        this.newConfirmationEvent.emit(result);
      }, (reason) => {
        console.log(reason);
      });
    })
  }

}
