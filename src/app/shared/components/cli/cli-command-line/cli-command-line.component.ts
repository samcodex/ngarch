import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { MatDialog } from '@angular/material';

import { AngularCliCommand } from '../../../../arch-cli/models/angular-cli';
import { CliExecutionComponent } from '../cli-execution/cli-execution.component';

@Component({
  selector: 'arch-cli-command-line',
  templateUrl: './cli-command-line.component.html',
  styleUrls: ['./cli-command-line.component.scss']
})
export class CliCommandLineComponent implements OnInit, AfterViewInit {

  @Input()
  command: AngularCliCommand;

  @ViewChild('inputOperand', {static: false})
  inputRef: ElementRef;

  constructor(
    public dialog: MatDialog,
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    if (this.inputRef) {
      const input = this.inputRef.nativeElement;
      const source = fromEvent(input, 'keyup');

      source.subscribe((event) => {
        const value = this.command.operand.name;
        input.style.width = value.length * 0.92 + 'ch';
      });
    }
  }

  get hasOperandPart() {
    return this.command.getOperandPart() !== null;
  }

  getCommandPart(): string {
    return this.command.getCommandPart();
  }

  getOptionsPart(): string {
    return this.command.getOptionsPart();
  }

  getOperandPart(): string {
    return this.command.getOperandPart();
  }

  getOperandInput(): string {
    const operand = this.getOperandPart();
    return operand;
  }

  onApply(event: Event) {
    event.stopPropagation();

    if (!!this.command.allowExecute) {
      const dialogRef = this.dialog.open(CliExecutionComponent, {
        width: '800px',
        height: '600px',
        data: this.command
      });

      dialogRef.afterClosed().subscribe(result => {

      });
    }
  }

  stopExpand(event: Event) {
    event.stopPropagation();
  }
}
