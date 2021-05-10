import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.css'],
})
export class DashboardCardComponent implements OnInit {
  @Input('totalConfirmed')
  totalConfirmed: number;
  @Input('totalRecovered')
  totalRecovered: number;
  @Input('totalActive')
  totalActive: number;
  @Input('totalDeaths')
  totalDeaths: number;
  constructor() {}

  ngOnInit(): void {}
}
