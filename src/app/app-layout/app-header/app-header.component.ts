import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { filter } from 'rxjs/operators';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { ProjectProfileService } from '@shared/project-profile';
import { ProjectInfo } from '@core/models/arch-project';

@Component({
  selector: 'arch-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit, OnDestroy {

  projectInfo: ProjectInfo;
  @Output() clickTopMenu = new EventEmitter<null>();

  constructor(
    private profileService: ProjectProfileService
  ) { }

  ngOnInit() {
    this.profileService.getProjectInfo()
      .pipe(
        filter(info => !!info),
        takeUntilNgDestroy(this)
      )
      .subscribe( projectInfo => {
        this.projectInfo = projectInfo;
      });
  }

  ngOnDestroy() {}

  onClickTopMenu() {
    this.clickTopMenu.emit();
  }
}
