import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { get } from 'lodash-es';
import { Subscription } from 'rxjs';

import { SlashPath } from '@core/slash-path';
import { ProjectConfig, ProjectProfileService } from '@shared/project-profile';
import { SocketHandlerService } from '@shared/services/socket-handler/socket-handler.service';

const icons = {None: 'mode_edit', Passed: 'check', Failure: 'error'};
const configProperties = ['root', 'app', 'main'];

@Component({
  selector: 'arch-project-config-dialog',
  templateUrl: './project-config-dialog.component.html',
  styleUrls: ['./project-config-dialog.component.scss']
})
export class ProjectConfigDialogComponent implements OnInit, OnDestroy {

  // existingConfigs: string[] = ['aa', 'bb'];

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

  subscription: Subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<ProjectConfigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private socketHandler: SocketHandlerService,
    private profileService: ProjectProfileService
  ) {
    this.setDialogData(data);
  }

  ngOnInit() {
    this.subscription.add(
      this.socketHandler.listen('check_result').subscribe(checkedData => {
        const name = get(checkedData, 'name');
        const value = get(checkedData, 'value');

        // if (name && value) {
          const ctrl: FormControl = this.formControllers[name];
          this.flags[name] = value ? StatusFlag.PASSED : StatusFlag.FAILURE;
          ctrl.setErrors({'notExist': !value});
        // }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.socketHandler.remove('check_result');
  }

  getIcon(flag: StatusFlag) {
    return icons[flag];
  }

  onEnter(name: string) {
    const value = this.getDialogValue(name);
    this.socketHandler.send('file_check', { name, value });
  }

  onClickApply() {
    const passed = configProperties.reduce(
      (accumulator, currentValue) => accumulator && !this.formControllers[currentValue].hasError('notExist')
      , true);

    if (passed) {
      const copiedData = this.getDialogData();

      this.profileService.updateProjectConfig(copiedData);
      this.dialogRef.close();
    }
  }

  onChangeApplicationFolder(name: string) {
    const root = this.getDialogValue(name);
    const rootPath = new SlashPath(root);

    const app = rootPath.resolve('src');
    const main = rootPath.resolve('src', 'main.ts');
    const data = {root, app, main};

    configProperties.forEach(field => {
      const value = data[field];

      this.setDialogValue(field, value);
      this.socketHandler.send('file_check', { name: field, value });
    });
  }

  private getDialogValue(name: string): any {
    const form: FormControl = this.formControllers[name];
    return form.value;
  }

  private setDialogValue(name: string, value: any) {
    const form: FormControl = this.formControllers[name];
    form.setValue(value);
  }

  private setDialogData(data: object) {
    configProperties.forEach(field => {
      const form: FormControl = this.formControllers[field];
      form.setValue(data[field]);
    });
  }

  private getDialogData(): object {
    const data = {};
    configProperties.forEach(field => {
      data[field] = this.getDialogValue(field);
    });

    return data;
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
