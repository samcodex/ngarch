import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'arch-flow-drop-down',
  templateUrl: './flow-drop-down.component.html',
  styleUrls: ['./flow-drop-down.component.scss']
})
export class FlowDropDownComponent implements OnInit {

  @Input() icon = 'menu';
  @Input() expanded = false;

  constructor() { }

  ngOnInit() {
  }

  toggleDropDown() {
    this.expanded = !this.expanded;
  }

}
