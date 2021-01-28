import { forOwn, get } from 'lodash-es';

import { NameValue } from '@core/models/name-value';
import { SemanticVersionClass } from './semantic-version';

const syn = /~|^/;

const infoPaths = {
  version: 'version',
  name: 'name',
  description: 'description',
  dependencies: 'dependencies',
  devDependencies: 'devDependencies'
};

const dependencies = {
  angular: '@angular/core',
  rxjs: 'rxjs',
  material: '@angular/material',
  bootstrap: 'bootstrap',
  lodash: 'lodash',
  'lodash-es': 'lodash-es',
  jquery: 'jquery'
};

const devDependencies = {
  typescript: 'typescript',
  protractor: 'protractor',
  karma: 'karma',
  jasmine: 'jasmine-core'
};

export class ProjectPackage {
  private _content: any;

  constructor(content: any) {
    this._content = content;
  }

  getValue(path: string): any {
    return get(this._content, path);
  }

  getVersion(path: string): SemanticVersionClass {
    const value = this.getValue(path);
    return value ? new SemanticVersionClass(value) : null;
  }

  getDependency(name: string): SemanticVersionClass {
    const path = 'dependencies.' + name;
    return this.getVersion(path);
  }

  getDevDependency(name: string): SemanticVersionClass {
    const path = 'devDependencies.' + name;
    return this.getVersion(path);
  }

  get content(): any {
    return this._content;
  }

  get projectVersion(): SemanticVersionClass {
    return this.getVersion(infoPaths.version);
  }

  get name(): string {
    return this.getValue(infoPaths.name);
  }

  get description(): string {
    return this.getValue(infoPaths.description);
  }

  get dependencies(): object {
    return this.getValue(infoPaths.dependencies);
  }

  get devDependencies(): object {
    return this.getValue(infoPaths.devDependencies);
  }

  getDependencyVersions(): NameValue<SemanticVersionClass>[] {
    const versions: NameValue<SemanticVersionClass>[] = [];
    forOwn(dependencies, (value, key) => {
      const version = this.getDependency(value);
      if (version) {
        const nameValue = new NameValue(key, version);
        versions.push(nameValue);
      }
    });

    return versions;
  }

  getDevDependencyVersions(): NameValue<SemanticVersionClass>[] {
    const versions: NameValue<SemanticVersionClass>[] = [];
    forOwn(devDependencies, (value, key) => {
      const version = this.getDevDependency(value);
      if (version) {
        const nameValue = new NameValue(key, version);
        versions.push(nameValue);
      }
    });

    return versions;
  }
}
