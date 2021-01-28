import { first, get } from 'lodash-es';
import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, UrlSegment, Router, NavigationEnd, ActivatedRouteSnapshot, Params } from '@angular/router';
import { combineLatest, BehaviorSubject, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { ArchNgPonentStore, ArchStoreData } from '@shared/arch-ngponent-store';
import { MokuaiContext } from '@ponent-mokuai/models/mokuai-context';
import { MetaValue } from '@core/models/meta-data';

@Injectable()
export class PonentMokuaiContextService implements OnDestroy {
  private mokuaiContext: MokuaiContext = new MokuaiContext();
  private storeData: ArchStoreData;
  private mokuaiContextStream = new BehaviorSubject<MokuaiContext>(this.mokuaiContext);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: ArchNgPonentStore
  ) {
    this.setupSteam();
  }

  getMokuaiContext(): Observable<MokuaiContext> {
    return this.mokuaiContextStream.asObservable()
      .pipe(
        filter(context => context.isContextUpdated)
      );
  }

  ngOnDestroy() {}

  private emitUpdatedMokuaiContext() {
    this.mokuaiContextStream.next(this.mokuaiContext);
  }

  private setupSteam() {
    const resetMokuaiContext = (viewerType: string, moduleId: string) => {
      const hostId = moduleId === MetaValue.Overview
        ? this.storeData.getMainNgModuleName() : moduleId;
      this.mokuaiContext.resetContext(viewerType, moduleId, hostId);
    };
    const resetContextFeature = (featureType: string, featurePath: string) => {
      this.mokuaiContext.resetFeature(featureType, featurePath);
    };
    const resetContextParams = (params: Params) => {
      this.mokuaiContext.params = params;
    };

    const getEndOfActivatedRoute = () => this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute.snapshot.firstChild),
      );
    const getMokuaiUrlSegments = () => this.activatedRoute.url
      .pipe(
        filter((urlSegments) => urlSegments && urlSegments.length >= 2)
      );

    const source = combineLatest([
      this.store.getValidStoreData(),
      getEndOfActivatedRoute(),
      getMokuaiUrlSegments()
    ]);

    source
      .pipe(
        takeUntilNgDestroy(this)
      )
      .subscribe(([storeData, childRoute, urlSegments]) => {
        this.mokuaiContext.isContextUpdated = false;

        this.storeData = storeData;
        const { viewerType, moduleId } = getMokuaiParams(urlSegments);
        const { featureType, featurePath } = getChildFeatures(childRoute);

        resetMokuaiContext(viewerType, moduleId);
        resetContextFeature(featureType, featurePath);
        resetContextParams(childRoute.queryParams);

        this.mokuaiContext.isContextUpdated = true;
        this.emitUpdatedMokuaiContext();
      }
    );
  }
}

function getMokuaiParams(urlSegments: UrlSegment[]) {
  let viewerType = null, moduleId = null;

  if (urlSegments && urlSegments.length >= 2) {
      const [segmentKey, segmentId] = urlSegments;
      viewerType = segmentKey.path;
      moduleId = segmentId.path;
  }

  return { viewerType, moduleId };
}

function getChildFeatures(snapshot: ActivatedRouteSnapshot) {
  const featureType = first(snapshot.url).path;
  const firstChild: ActivatedRouteSnapshot = get(snapshot, 'firstChild');
  const featurePath = firstChild && firstChild.url.length ? first(firstChild.url).path : null;

  return { featureType, featurePath };
}
