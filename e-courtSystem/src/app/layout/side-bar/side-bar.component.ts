import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserQuery } from 'src/app/core/state/user/user.query';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  userRole;

  constructor(
    private spinner: NgxSpinnerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getUserRole();
  }

  getUserRole() {
    this.authService.getUserProfile().subscribe(
      (res: any) => {
        this.userRole = res.role[0];
      },
      err => {
        console.log(err);
      },
    );
  }
}
