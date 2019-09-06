import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'arch-tian-title',
  template: '<ng-content></ng-content>',
  styles: [`:host {
    padding-top: 5px;
    padding-left: 15px;
    font-weight: 600;
    background-color: white;
    height: 30px;
    box-shadow:3px 3px 10px 2px #cfcfcf ;
    width: 100%;
    box-sizing: border-box;
  }`]
})
export class TianTitleComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
