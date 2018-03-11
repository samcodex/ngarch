import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ProjectConfigDialogComponent } from '../project-config-dialog/project-config-dialog.component';
import { ProjectConfigService } from '../shared/services/project-config/project-config.service';
import { ProjectConfig } from '../core/models/project-config';

@Component({
  selector: 'arch-arch-header',
  templateUrl: './arch-header.component.html',
  styleUrls: ['./arch-header.component.scss']
})
export class ArchHeaderComponent implements OnInit {

  projectConfig: ProjectConfig;

  constructor(
    private configService: ProjectConfigService,
    private dialog: MatDialog

  ) { }

  ngOnInit() {
    this.configService.getData().subscribe( data => this.projectConfig = data);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ProjectConfigDialogComponent, {
      width: '350px',
      data: this.projectConfig
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed', result);
    });
  }
}
