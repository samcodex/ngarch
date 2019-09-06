import { Component, OnInit, Input, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { CliOptionValue } from '../../../../arch-cli/models/angular-cli/angular-cli-command';

@Component({
  selector: 'arch-cli-option-input',
  templateUrl: './cli-option-input.component.html',
  styleUrls: ['./cli-option-input.component.scss']
})
export class CliOptionInputComponent implements OnInit, AfterViewInit {
  @Input()
  optionValue: CliOptionValue;
  @Input()
  disabled: Observable<boolean>;

  @ViewChild('inputOption')
  inputRef: ElementRef;

  constructor() { }

  // CheckBox, InputFiled, Selection
  get inputType(): string {
    return this.optionValue.inputType;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.inputRef) {
      const input = this.inputRef.nativeElement;
      const source = fromEvent(input, 'keyup');

      source
        .pipe(
          debounceTime(750),
          distinctUntilChanged(),
        )
        .subscribe((event) => {

        });
    }
  }

  onCheckBoolean(event: Event) {

  }
}
