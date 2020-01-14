import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Component, OnInit, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';
import { zip } from 'rxjs';

import { NgAppViewerService } from '../services/ng-app-viewer.service';
import { mapViewPurposeToUiClass } from '../models/viewer-content-config';
import { mapOfNgAppViewer } from '../models/ng-app-viewer-config';
import { ViewerContentHierarchyIndicator, ArchViewerHierarchy } from '../viewers/config/arch-viewer-definition';


@Component({
  template: '<ng-arch-ui></ng-arch-ui>'
})
export class NgAppViewerComponent implements OnInit, OnDestroy {

  constructor(
    private resolver: ComponentFactoryResolver,
    private ngAppViewerService: NgAppViewerService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
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

    this.ngAppViewerService.initializeMainViewer(this.resolver, viewerId, contentHierarchy, mapOfNgAppViewer, mapViewPurposeToUiClass);
  }
}
