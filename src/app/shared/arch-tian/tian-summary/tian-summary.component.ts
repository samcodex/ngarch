import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'arch-tian-summary',
  template: '<ng-content></ng-content>',
  styles: [`:host {
    display: block;
    flex: 1;
    box-sizing: border-box;
    bottom: 0px;
    overflow: hidden;
    position: relative;
  }`]
})
export class TianSummaryComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
