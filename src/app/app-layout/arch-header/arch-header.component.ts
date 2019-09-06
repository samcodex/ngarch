import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { ProjectConfig, ProjectProfileService } from '@shared/project-profile';
import { ProjectConfigDialogComponent } from '../project-config-dialog/project-config-dialog.component';
import { ArchHelpComponent } from './../arch-help/arch-help.component';

const keyOfDisplayedHelp = 'HasDisplayedHelp';
const initConfig = {
  root: null,
  app: null,
  main: null
};

@Component({
  selector: 'arch-header',
  templateUrl: './arch-header.component.html',
  styleUrls: ['./arch-header.component.scss']
})
export class ArchHeaderComponent implements OnInit, OnDestroy {

  projectConfig: ProjectConfig = initConfig;
  relationStatus = 'none';        // none/composition/dependency/association/inheritance

  constructor(
    private dialog: MatDialog,
    private profileService: ProjectProfileService,
    private localStorage: LocalStorage
  ) { }

  ngOnInit() {
    this.profileService.getProjectConfig()
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe( data => this.projectConfig = data ? data : initConfig);

    this.localStorage.getItem(keyOfDisplayedHelp).subscribe(value => {
      if (!value) {
        this.displayHelpMessage();
      }
    });
  }

  ngOnDestroy() {}

  openProjectConfig(): void {
    const dialogRef = this.dialog.open(ProjectConfigDialogComponent, {
      width: '580px',
      data: this.projectConfig
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe(result => {
    });
  }

  openHelp() {
    this.dialog.open(ArchHelpComponent, {
      width: '95%',
      height: '95%'
    });
  }

  changeStatus(status: string) {
    this.relationStatus = status;

    this.localStorage.setItem(keyOfDisplayedHelp, true)
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe();
  }

  private displayHelpMessage() {
    setTimeout(() => {
      this.relationStatus = 'composition';

      setTimeout(() => {
        this.relationStatus = 'dependency';

        setTimeout(() => {
          this.relationStatus = 'none';
        }, 2000);

      }, 2000);
    });
  }
}
