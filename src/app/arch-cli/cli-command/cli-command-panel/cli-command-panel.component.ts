import { Component, OnInit, Input } from '@angular/core';

import { AngularCliCommand, CliOptionPart, AngularCliHelper } from '../../models/angular-cli';

@Component({
  selector: 'arch-cli-command-panel',
  templateUrl: './cli-command-panel.component.html',
  styleUrls: ['./cli-command-panel.component.scss']
})
export class CliCommandPanelComponent implements OnInit {
  @Input()
  command: AngularCliCommand;
  @Input()
  expanded: boolean;

  helper = AngularCliHelper;

  constructor(

  ) { }

  ngOnInit() {

  }

  applyOption(option: CliOptionPart) {

  }

}
