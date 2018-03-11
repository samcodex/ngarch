import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, ErrorStateMatcher } from '@angular/material';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { get } from 'lodash';
import { Subscription } from 'rxjs/Subscription';

import { ProjectConfigService } from '../shared/services/project-config/project-config.service';
import { ProjectConfig } from '../core/models/project-config';
import { SocketHandlerService } from './../shared/services/socket-handler/socket-handler.service';

const icons = {None: 'mode_edit', Passed: 'check', Failure: 'error'};

@Component({
  selector: 'arch-project-config-dialog',
  templateUrl: './project-config-dialog.component.html',
  styleUrls: ['./project-config-dialog.component.scss']
})
export class ProjectConfigDialogComponent implements OnInit, OnDestroy {

  fields = ['root', 'app', 'main'];

  flags: ProjectConfig = {
    root: StatusFlag.NONE,
    app: StatusFlag.NONE,
    main: StatusFlag.NONE
  };

  formControllers: ProjectConfig = {
    root: new FormControl('', [Validators.required]),
    app: new FormControl('', [Validators.required]),
    main: new FormControl('', [Validators.required])
  };

  matcher = new MyErrorStateMatcher();

  subscription: Subscription;

  copiedData: ProjectConfig;

  constructor(
    private configService: ProjectConfigService,
    public dialogRef: MatDialogRef<ProjectConfigDialogComponent>,
    private socketHandler: SocketHandlerService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.copiedData = Object.assign({}, data);
    }

  ngOnInit() {
    this.subscription = this.socketHandler.listen('check_result').subscribe(checkedData => {
      const name = get(checkedData, 'name');
      const value = get(checkedData, 'value');

      // if (name && value) {
        const ctrl: FormControl = this.formControllers[name];
        this.flags[name] = value ? StatusFlag.PASSED : StatusFlag.FAILURE;
        ctrl.setErrors({'notExist': !value});
      // }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.socketHandler.remove('check_result');
  }

  getIcon(flag: StatusFlag) {
    return icons[flag];
  }

  onEnter(name: string) {
    this.socketHandler.send('file_check', {name: name, value: this.copiedData[name]});
  }

  onClickApply() {
    const passed = this.fields.reduce(
      (accumulator, currentValue) => accumulator && !this.formControllers[currentValue].hasError('notExist')
      , true);

    if (passed) {
      this.configService.update(this.copiedData);

      this.dialogRef.close();
    }

  }

}

enum StatusFlag {
  NONE = 'None',
  PASSED = 'Passed',
  FAILURE = 'Failure'
}


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
