import { NgPonentType } from './../../core/ngponent-tsponent/ngponent-definition';
import { Component, OnInit, Input } from '@angular/core';

import { ArchNgPonent } from '../../core/arch-ngponent';
import { IArchNgPonentMetadata } from './../../core/arch-ngponent';

const listMetadata = [NgPonentType.NgModule, NgPonentType.Component, NgPonentType.Directive];
const listTsMembers = [NgPonentType.Injectable];

@Component({
  selector: 'arch-summary-table-ngponent',
  templateUrl: './summary-table-ngponent.component.html',
  styleUrls: ['./summary-table-ngponent.component.scss']
})
export class SummaryTableNgponentComponent implements OnInit {
  @Input()
  archNgPonent: ArchNgPonent;

  metadata: IArchNgPonentMetadata;
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
      this.usedProperties = this.archNgPonent.metadata.usedProperties;
      this.metadata = this.archNgPonent.metadata;
    }

    if (this.hasTsMembers) {
      const dependencies = this.archNgPonent.listDependencies();
      const properties = this.archNgPonent.listProperties();
      const methods = this.archNgPonent.listMethods();

      this.tsValues.dependencies = dependencies ? dependencies.join(',') : null;
      this.tsValues.properties = properties ? properties.join(',') : null;
      this.tsValues.methods = methods ? methods.join(',') : null;
    }

  }

}
