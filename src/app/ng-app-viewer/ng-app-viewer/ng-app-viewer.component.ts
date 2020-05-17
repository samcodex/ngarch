import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Component, OnInit, ComponentFactoryResolver, OnDestroy, Input } from '@angular/core';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';
import { zip } from 'rxjs';

import { NgAppViewerService } from '../services/ng-app-viewer.service';
import { mapViewPurposeToUiClass } from '../models/viewer-content-config';
import { mapOfNgAppViewer } from '../models/ng-app-viewer-config';
import { ViewerContentHierarchyIndicator, ArchViewerHierarchy } from '../viewers/config/arch-viewer-definition';


@Component({
  selector: 'arch-ng-app-viewer',
  template: '<ng-arch-ui [desktopData]="viewerData"></ng-arch-ui>',
  providers: [
    NgAppViewerService
  ]
})
export class NgAppViewerComponent implements OnInit, OnDestroy {
  @Input() viewerId: string = null;
  @Input() contentHierarchyKey: ArchViewerHierarchy = null;
  viewerData = {
    tianLayout: false,
    initialScale: 1
  };

  constructor(
    private resolver: ComponentFactoryResolver,
    private ngAppViewerService: NgAppViewerService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    if (this.viewerId && this.contentHierarchyKey) {
      const contentHierarchy: ArchViewerHierarchy = ArchViewerHierarchy[this.contentHierarchyKey];
      this.viewerData.tianLayout = false;
      this.viewerData.initialScale = 0.4;

      this.initMainViewer(this.viewerId, contentHierarchy);
    } else {
      this.viewerData.tianLayout = true;
      this.viewerData.initialScale = 0.8;

      const source = zip(
        this.activatedRoute.url,
        this.activatedRoute.data
      );

      source
        .pipe(
          takeUntilNgDestroy(this)
        )
        .subscribe(this.initWithSegments.bind(this));
    }
  }

  ngOnDestroy() {

  }

  private initWithSegments([urlSegments, data]: [ UrlSegment[], ViewerContentHierarchyIndicator]) {
    let viewerId = null, contentHierarchy: ArchViewerHierarchy = null;

    if (urlSegments && urlSegments.length >= 2) {
      const [segmentKey, segmentId] = urlSegments;
      const viewerKey = segmentKey.path;
      viewerId = viewerKey === 'viewer' ? segmentId.path : null;
    }
    if (data && data.hasOwnProperty('contentHierarchy')) {
      contentHierarchy = data.contentHierarchy;
    }

    this.initMainViewer(viewerId, contentHierarchy);
  }

  private initMainViewer(viewerId: string, contentHierarchy: ArchViewerHierarchy) {
    this.ngAppViewerService.initializeMainViewer(this.resolver, viewerId, contentHierarchy, mapOfNgAppViewer, mapViewPurposeToUiClass);
  }
}
