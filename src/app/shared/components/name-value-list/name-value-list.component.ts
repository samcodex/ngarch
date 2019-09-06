import { Component, OnInit, Input } from '@angular/core';
import { NameValue } from '../../../core/models/name-value';

@Component({
  selector: 'arch-name-value-list',
  templateUrl: './name-value-list.component.html',
  styleUrls: ['./name-value-list.component.scss']
})
export class NameValueListComponent implements OnInit {

  @Input() nameValues: NameValue[];

  constructor() { }

  ngOnInit() {

  }

}
