import { ProjectConfig, isInvalidProjectConfig } from './project-config';
import { ProjectPackage } from './project-package';

export class ProjectProfile {
  private _projectConfig: ProjectConfig;
  private _projectPackage: ProjectPackage;

  constructor() {}

  get projectConfig() {
    return this._projectConfig;
  }

  get projectPackage() {
    return this._projectPackage;
  }

  get isValid(): boolean {
    return !isInvalidProjectConfig(this._projectConfig);
  }

  setProjectConfig(config: {}) {
    this._projectConfig = config as ProjectConfig;
  }

  setProjectPackage(pkg: {}) {
    this._projectPackage = new ProjectPackage(pkg);
  }

  clear() {
    this._projectConfig = null;
    this._projectPackage = null;
  }
}
