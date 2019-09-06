import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Component, OnInit, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { NgAppViewerService } from '../services/ng-app-viewer.service';
import { mapViewPurposeToUiClass } from '../models/viewer-content-config';
import { mapOfNgAppViewer } from '../models/ng-app-viewer-config';


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
    this.activatedRoute.url
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe(this.initWithSegments.bind(this));
  }

  ngOnDestroy() {

  }

  private initWithSegments(urlSegments: UrlSegment[]) {
    let viewerId = null;

    if (urlSegments && urlSegments.length >= 2) {
      const [segmentKey, segmentId] = urlSegments;
      const viewerKey = segmentKey.path;
      viewerId = viewerKey === 'viewer' ? segmentId.path : null;
    }

    this.ngAppViewerService.initializeMainViewer(this.resolver, viewerId, mapOfNgAppViewer, mapViewPurposeToUiClass);
  }
}
