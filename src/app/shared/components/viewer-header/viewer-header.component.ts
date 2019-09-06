import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'arch-viewer-header',
  templateUrl: './viewer-header.component.html',
  styleUrls: ['./viewer-header.component.scss']
})
export class ViewerHeaderComponent implements OnInit {

  // @Output()
  // clickInfoIcon = new EventEmitter();
  @Input() hasIcon = true;

  constructor() { }

  ngOnInit() {
  }

  // onClickInfo() {
  //   this.clickInfoIcon.emit();
  // }
}
