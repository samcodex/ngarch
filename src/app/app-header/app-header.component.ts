import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

import { ProjectInfoService } from '../shared/services/project-info/project-info.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'arch-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit {

  projectInfo: ProjectInfo;

  constructor(
    private infoService: ProjectInfoService,
  ) { }

  ngOnInit() {
    this.infoService.getData().subscribe(data => {
      this.projectInfo = <ProjectInfo>data;
    });
  }
}

interface ProjectInfo {
  name: string;
  version: string;
  description: string;
}

