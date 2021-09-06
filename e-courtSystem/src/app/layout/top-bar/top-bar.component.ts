import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {
  userDetails;

  constructor(private router: Router,
    private spinner: NgxSpinnerService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.authService.getUserProfile().subscribe(
      res => {
        console.log(res);
        this.userDetails = res;
      },
      err => {
        console.log(err);
      },
    );
  }

  onLogout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

}
