import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChartDataSets, ChartType, RadialChartOptions } from 'chart.js';
import { ArrestService } from 'src/app/core/service/arrest.service';
import { Label } from 'ng2-charts';
import { UserQuery } from 'src/app/core/state/user/user.query';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // ============= Chart Start =============
  public radarChartOptions: RadialChartOptions = {
    responsive: true,
  };
  public radarChartLabels: Label[] = ['Active', 'Canceled', 'Ongoing'];
  public radarChartData: ChartDataSets[];
  public radarChartType: ChartType = 'radar';
  // ============= Chart End =============
  userRole;
  arrestData: any[];
  arrestCount: number = 0;
  caseCount: number = 0;
  ongoingCaseCount: number = 0;
  closedCaseCount: number = 0;
  completedCaseCount: number = 0;

  constructor(
    private spinner: NgxSpinnerService,
    private userQuery: UserQuery,
    private arrestService: ArrestService) {
    this.radarChartData = [
      { data: [], label: 'Arrest' },
      { data: [], label: 'Case' }
    ];
  }

  ngOnInit(): void {
    this.getUserRole();
    this.getArrestByStatus();
  }

  getUserRole() {
    const userData = this.userQuery.getAll();
    this.userRole = userData[0].role;
  }

  getArrestByStatus() {
    this.spinner.show();
    this.arrestService.getArrest()
      .subscribe(
        (arrestList) => {
          this.arrestData = arrestList;
          this.arrestCount = arrestList.filter(x => x.status == 1).length;
          this.caseCount = arrestList.filter(x => x.status == 2).length;
          this.ongoingCaseCount = arrestList.filter(x => x.status == 2).length;
          this.closedCaseCount = arrestList.filter(x => x.status == 3).length;
          this.radarChartData[0].data = [this.arrestCount, this.closedCaseCount, this.ongoingCaseCount];
          this.radarChartData[1].data = [this.caseCount, this.closedCaseCount, this.ongoingCaseCount];
          this.spinner.hide();
        }
      );
  }


}
