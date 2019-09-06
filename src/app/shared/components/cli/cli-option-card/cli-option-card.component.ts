import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CliOptionPart } from '../../../../arch-cli/models/angular-cli/angular-cli-command';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'arch-cli-option-card',
  templateUrl: './cli-option-card.component.html',
  styleUrls: ['./cli-option-card.component.scss']
})
export class CliOptionCardComponent implements OnInit {
  @Input()
  option: CliOptionPart;

  @Output()
  apply: EventEmitter<any> = new EventEmitter();

  private disabledObserver: Observer<boolean>;
  disabledObservable: Observable<boolean>;

  constructor() { }

  ngOnInit() {
    this.disabledObservable = Observable.create((observer: Observer<boolean>) => {
      this.disabledObserver = observer;
      observer.next(true);
    });
  }

  select(event: Event) {
    this.option.isUsed = !this.option.isUsed;
    if (!this.option.isUsed) {
      this.option.setOptionInitialValue();
    } else {
      const optionValue = this.option.optionValue;
      optionValue.inputValue = optionValue.defaultValue;
    }

    this.disabledObserver.next(!this.option.isUsed);
    this.apply.emit(this.option);
  }

  get isChecked(): boolean {
    return !!this.option.optionValue && !!this.option.isUsed;
  }
}
