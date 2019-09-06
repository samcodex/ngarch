import { Component, Input, OnInit } from '@angular/core';
import { get } from 'lodash-es';

import { ArchNgPonent } from '../../core/arch-ngponent';
import { NgPonentType } from '../../core/ngponent-tsponent';
import { ProjectConfig } from '../../shared/project-profile';

const listMetadata = [NgPonentType.NgModule, NgPonentType.Component, NgPonentType.Directive];
const listTsMembers = [NgPonentType.Injectable];

@Component({
  selector: 'arch-loading-group',
  templateUrl: './loading-group.component.html',
  styleUrls: ['./loading-group.component.scss']
})
export class LoadingGroupComponent implements OnInit {

  @Input()
  archNgPonent: ArchNgPonent;
  @Input()
  projectConfig: ProjectConfig;

  archMetadata = {};
  usedProperties: string[] = new Array<string>();

  hasMetadata = false;
  hasTsMembers = false;

  tsValues: {
    dependencies: string,
    properties: string,
    methods: string
  } = {
    dependencies: null,
    properties: null,
    methods: null
  };
  tsKeys: string[] = Object.keys(this.tsValues);

  constructor() {
  }

  ngOnInit() {
    this.hasMetadata = listMetadata.indexOf(this.archNgPonent.ngPonentType) > -1;
    this.hasTsMembers = listTsMembers.indexOf(this.archNgPonent.ngPonentType) > -1;

    if (this.hasMetadata) {
      const ponentMetadata = this.archNgPonent.archMetadata;
      this.usedProperties = ponentMetadata.usedProperties;
      this.archMetadata = ponentMetadata.listMetadataWithString();

    } else if (this.hasTsMembers) {
      const dependencies = this.archNgPonent.listCtorDependencies();
      const properties = this.archNgPonent.listClassProperties();
      const methods = this.archNgPonent.listClassMethods();

      this.tsValues.dependencies = dependencies ? dependencies.join(',') : null;
      this.tsValues.properties = properties ? properties.join(',') : null;
      this.tsValues.methods = methods ? methods.join(',') : null;
    }

  }

  get isUnused(): boolean {
    return this.archNgPonent.isIsolatedPonent;
  }

  replaceRootPath(path) {
    const absolutePath = get(this.projectConfig, 'options.absolutePath.app');
    const relatePath = path.replace(absolutePath, '');

    return relatePath;
  }
}
