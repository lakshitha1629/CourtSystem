import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-details-view',
  templateUrl: './details-view.component.html',
  styleUrls: ['./details-view.component.scss']
})
export class DetailsViewComponent implements OnInit {
  @Input() name: string;
  @Input() nic: string;
  @Input() place: string;
  @Input() reason: string;
  @Input() remark: string;
  @Input() officer: string;
  @Input() date: any;

  constructor() { }

  ngOnInit(): void {
  }

}
