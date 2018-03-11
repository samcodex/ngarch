import { Injectable } from '@angular/core';
import * as path from 'path';

import { ProjectConfig } from '../../../core/models/project-config';

// root: "../ngarch/",
//   app: "../ngarch/src/app/",
//   main: "../ngarch/src/main.ts"

@Injectable()
export class ArchConfigService {

  hostname: string;
  port: string;

  projectConfig: ProjectConfig;

  endPoints: {[key: string]: string} = {
    [ArchEndPoints.NgArch]: 'ngarch',
    [ArchEndPoints.ProjectConfig]: 'project-config',
    [ArchEndPoints.ProjectFiles]: 'project-files',
    [ArchEndPoints.ProjectInfo]: 'project-info'
  };

  constructor() {
    // this.projectConfig.root = '';
    this.hostname = 'localhost';
    this.port = '3000';
  }

  get domain(): string {
    return `${this.hostname}:${this.port}`;
  }

  getDomainUrl(protocol: Protocol = Protocol.Http): string {
    return protocol + '://' + this.domain;
  }

  getEndPoint(name: ArchEndPoints): string {
    return this.getDomainUrl() + '/api/' +  this.endPoints[name];
  }
}

export enum ArchEndPoints {
  NgArch = 'NgArch',
  ProjectConfig = 'ProjectConfig',
  ProjectFiles = 'ProjectFiles',
  ProjectInfo = 'ProjectInfo'
}

export enum Protocol {
  Http = 'http',
  WebSocket = 'ws'
}
