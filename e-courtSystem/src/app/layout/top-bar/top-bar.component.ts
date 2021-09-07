import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { guid } from '@datorama/akita';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserStateService } from 'src/app/core/state/user/user-state.service';
import { User } from 'src/app/core/state/user/user.model';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  userDetails;
  userRole;

  constructor(private router: Router,
    private userStateService: UserStateService,
    private spinner: NgxSpinnerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.authService.getUserProfile().subscribe(
      (res: any) => {
        this.userDetails = res;
        this.userStateService.addUser({
          id: guid(),
          email: res.email,
          role: res.role[0],
          userName: res.userName
        } as User);
        // console.log(res.role[0]);
      },
      err => {
        console.log(err);
      },
    );
  }

  onLogout() {
    localStorage.removeItem('token');
    this.userStateService.deleteAllUser();
    this.router.navigateByUrl('/login');
  }

}
