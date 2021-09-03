import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/core/base.component';
import { ArrestService } from 'src/app/core/service/arrest.service';

@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.scss']
})
export class CaseComponent extends BaseComponent implements OnInit {
  arrestData: any[];

  constructor(private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private arrestService: ArrestService) {
    super();
  }

  ngOnInit(): void {
    this.getArrestByStatus();
  }

  getArrestByStatus() {
    this.spinner.show();
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
