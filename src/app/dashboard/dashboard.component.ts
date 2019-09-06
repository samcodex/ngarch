import { Component, OnInit } from '@angular/core';
import { BoardItem } from './models/board-item';
import { DashboardConfig } from './config/dashboard-config';

@Component({
  selector: 'arch-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  boardItems: BoardItem[];

  constructor() { }

  ngOnInit() {
    this.boardItems = DashboardConfig;
  }

}
