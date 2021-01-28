import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { ArchEndPoints } from '../../config';
import { Pausable } from '@core/pausable';
import { IReloadable, ReloadRegisterService } from '../reloadable';
import { RestService } from '../services/rest/rest.service';
import { ProjectConfig } from './models/project-config';
import { ProjectPackage } from './models/project-package';
import { ProjectProfile } from './models/project-profile';
import { ProjectInfo, versionList } from '@core/models/arch-project';
import { NameValue } from '@core/models/name-value';

@Injectable({
  providedIn: 'root'
})
export class ProjectProfileService extends Pausable<ProjectProfile> implements IReloadable {

  private projectProfile = new ProjectProfile();
  private profileStream = new BehaviorSubject<ProjectProfile>(undefined);
  private configPath = ArchEndPoints.projectConfig;
  private packagePath = ArchEndPoints.projectInfo;

  constructor(
    private rest: RestService,
    private reloadRegister: ReloadRegisterService
  ) {
    super(1);
    this.reloadRegister.register(this);
    this.initialize(this.profileStream.asObservable());

    this.setupStream();
  }

  private setupStream() {
    combineLatest([
      this.rest.getWithReloader<ProjectConfig>(this.configPath, true, true),
      this.rest.getWithReloader(this.packagePath, true, true)
    ]).subscribe(([profile, pkg ]) => {

      this.projectProfile.setProjectConfig(profile);
      if (pkg) {
        this.projectProfile.setProjectPackage(pkg);
      }

      this.profileStream.next(this.projectProfile);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  reload() {
    this.resume();
  }

  getProjectProfile(): Observable<ProjectProfile> {
    return this.source;
    // return this.profileStream.asObservable();
  }

  getProjectConfig(): Observable<ProjectConfig> {
    return this.getProjectProfile()
      .pipe(
        filter(profile => profile && profile instanceof ProjectProfile && profile.isValid),
        map(profile => profile.projectConfig)
      );
  }

  getProjectPackage(): Observable<ProjectPackage> {
    return this.getProjectProfile()
      .pipe(
        filter(profile => profile && profile instanceof ProjectProfile && profile.isValid),
        map(profile => profile.projectPackage)
      );
  }

  getProjectName(): Observable<string> {
    return this.getProjectPackage()
      .pipe(
        filter(pkg => !!pkg),
        map((projectPackage) => projectPackage.name)
      );
  }

  getCurrentProjectName(): string {
    const profile = this.profileStream.value;
    return profile && profile.projectPackage ? profile.projectPackage.name : null;
  }

  getProjectInfo(): Observable<ProjectInfo> {
    return this.getProjectPackage()
      .pipe(
        filter(pkg => !!pkg),
        map((projectPackage) => {
          const name = projectPackage.name;
          const version = projectPackage.projectVersion.semanticVersion;
          const description = projectPackage.description;
          const dependencyVersions = projectPackage.getDependencyVersions();
          const devDependencyVersions = projectPackage.getDevDependencyVersions();
          const allDependencyVersion = [...dependencyVersions, ...devDependencyVersions];

          const dependencies = allDependencyVersion
            .filter(ver => versionList.includes(ver.name))
            .map(ver => new NameValue(ver.name, ver.value.semanticVersion));

          return {name, version, description, dependencies};
        })
      );
  }

  updateProjectConfig(config: {}) {
    this.projectProfile.clear();

    this.rest.post(this.configPath, config).subscribe();
  }
}
