import { Component, OnInit, OnDestroy } from '@angular/core';
import { get } from 'lodash-es';
import { zip } from 'rxjs';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { ArchNgPonentLoadingGroup, ArchNgPonentStore } from '@shared/arch-ngponent-store';
import { ProjectConfig, ProjectProfileService } from '@shared/project-profile';

@Component({
  selector: 'arch-loading-strategy',
  templateUrl: './loading-strategy.component.html',
  styleUrls: ['./loading-strategy.component.scss']
})
export class LoadingStrategyComponent implements OnInit, OnDestroy {

  archNgPonentGroups: ArchNgPonentLoadingGroup[] = [];
  projectConfig: ProjectConfig;
  absolutePath: string;

  constructor(
    private store: ArchNgPonentStore,
    private profileService: ProjectProfileService
  ) { }

  ngOnInit() {
    zip(
      this.profileService.getProjectConfig(),
      this.store.getAllImportedPonentsGroupByLoadingModule()
    )
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe(data => {
        const [config, ponentData] = data;

        this.archNgPonentGroups = ponentData;
        this.projectConfig = config;
        this.absolutePath = get(this.projectConfig, 'options.absolutePath.app');

      });
  }

  ngOnDestroy() {}

  replaceRootPath(path) {
    const relatePath = path.replace(this.absolutePath, '');
    return relatePath;
  }
}
