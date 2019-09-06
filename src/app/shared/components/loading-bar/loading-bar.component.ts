import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'arch-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss']
})
export class LoadingBarComponent implements OnInit {
  @Input() loading = false;

  constructor() { }

  ngOnInit() {
  }

}
