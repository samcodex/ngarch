import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'arch-tian-main',
  template: '<ng-content></ng-content>',
  styles: [`:host {
    position: absolute;
    overflow:auto;
    top: 30px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    display: block;
    flex: 1;
    box-sizing: border-box;
  }`],
})
export class TianMainComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
