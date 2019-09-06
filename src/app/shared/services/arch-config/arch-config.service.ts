import { Injectable, Inject } from '@angular/core';

import { ArchEndPoint } from '../../../config/end-point-definition';
import { ProjectConfig } from '../../project-profile';
import { WINDOW } from 'app/arch.env';

export enum Protocol {
  Http = 'http',
  WebSocket = 'ws'
}

const defaultPort = '3000';
// root: "../ngarch/",
// app: "../ngarch/src/",
// main: "../ngarch/src/main.ts"

@Injectable()
export class ArchConfigService {

  private hostname: string;
  private port: string;

  private projectConfig: ProjectConfig;

  constructor(
    @Inject(WINDOW) private window: Window
  ) {
    // this.projectConfig.root = '';
    this.hostname = 'localhost';
    this.port = defaultPort; // this.window.location.port || defaultPort;
  }

  get domain(): string {
    return `${this.hostname}:${this.port}`;
  }

  getDomainUrl(protocol: Protocol = Protocol.Http): string {
    return protocol + '://' + this.domain;
  }

  getEndPoint(endPoint: ArchEndPoint): string {
    return this.getDomainUrl() + '/api/' +  endPoint.path;
  }

  changePort(port: string) {
    this.port = port;
  }
}
