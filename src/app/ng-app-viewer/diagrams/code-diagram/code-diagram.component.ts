import { Component, OnInit } from '@angular/core';

import { ArchUiDiagramComponent } from '../../models/viewer-content-types';
import { RestService } from '@shared/services/rest/rest.service';
import { ArchNgPonent } from '@core/arch-ngponent';
import { ArchEndPoint } from '@config/end-point-definition';
import { ProjectProfileService } from '@shared/project-profile';
import { ArchNode } from '@core/arch-tree/arch-tree';
import { ViewerType, DiagramViewerType } from '../../models/ng-app-viewer-definition';

const languages = [ 'typescript', 'html', 'css' ];

@Component({
  selector: 'arch-code-diagram',
  templateUrl: './code-diagram.component.html',
  styleUrls: ['./code-diagram.component.scss']
})
export class CodeDiagramComponent implements OnInit, ArchUiDiagramComponent {
  data: ArchNode | ArchNgPonent;     // pass dynamically
  fromViewer: ViewerType | DiagramViewerType;

  language: string;       // pass dynamically
  private archNgPonent: ArchNgPonent;

  sourceCodes: any[] = [];

  constructor(
    private rest: RestService,
    private profile: ProjectProfileService
  ) { }

  ngOnInit() {
    this.archNgPonent = this.data instanceof ArchNgPonent ? this.data : this.data.archNgPonent;
    this.language = languages.includes(this.language) ? this.language : languages[0];

    if (this.language === 'html') {
      this.resolveHtml();
    } else if (this.language === 'css') {
      this.resolveCss();
    } else {
      this.resolveTypeScript();
    }
  }

  private resolveHtml() {
    const template = this.archNgPonent.getMetadataOf('template');
    let templateUrl = this.archNgPonent.getMetadataOf('templateUrl');
    if (templateUrl) {
      templateUrl = templateUrl[0];
      const filename = this.resolveFilename(templateUrl);
      if (filename) {
        this.fetchSourceCode(filename);
      }
    } else if (template) {
      this.sourceCodes.push(template);
    }
  }

  private resolveCss() {
    const styles = this.archNgPonent.getMetadataOf('styles');
    const styleUrls: any[] = this.archNgPonent.getMetadataOf('styleUrls');
    if (styleUrls) {
      styleUrls.forEach(styleUrl => {
        const filename = this.resolveFilename(styleUrl);
        if (filename) {
          this.fetchSourceCode(filename);
        }
      });
    } else if (styles) {
      this.sourceCodes.push(styles);
    }
  }

  private resolveTypeScript() {
    if (this.data && this.archNgPonent.angularFilePath) {
      const filename = this.archNgPonent.angularFilePath.fullFilePath;
      this.fetchSourceCode(filename);
    } else {
      this.profile.getProjectConfig().subscribe(config => {
        const mainFilename = config.main;
        this.fetchSourceCode(mainFilename);
      });
    }
  }

  private fetchSourceCode(filename: string ) {
    const path = 'file?name=' + filename;
    const endPoint: ArchEndPoint = { path};

    this.rest.get(endPoint).subscribe(source => {
      this.sourceCodes.push(source);
    });
  }

    private resolveFilename(fileUrl: any): string {
    let filename = null;
    try {
      filename = eval(fileUrl);
    } catch (err) { }

    if (filename) {
      filename = this.archNgPonent.angularFilePath.resolveFilePath(filename);
    }

    return filename;
  }
}

