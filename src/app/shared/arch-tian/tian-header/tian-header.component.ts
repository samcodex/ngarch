import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'arch-tian-header',
  template: '<ng-content></ng-content>',
  styles: [`
    background-color: white;
    height: 30px;
    box-shadow:3px 3px 10px 2px #cfcfcf ;
  `]
})
export class TianHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
