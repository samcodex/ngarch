import { Injectable, OnDestroy } from '@angular/core';
import { first, last } from 'lodash-es';
import { BehaviorSubject, combineLatest, Observable, ReplaySubject } from 'rxjs';
import { filter, map, mergeMap, tap, debounceTime } from 'rxjs/operators';
import { takeUntilNgDestroy } from 'take-until-ng-destroy';

import { ArchNgPonent } from '@core/arch-ngponent';
import { RelationshipType } from '@core/arch-relationship/relationship-definition';
import { MetaValue } from '@core/models/meta-data';
import { UiElementItem } from '@core/models/ui-element-item';
import { ClassLevelPonentTypes } from '@core/ngponent-tsponent';
import { ArchNgPonentStore } from '@shared/arch-ngponent-store';
import { mapOptionToRelationshipType, MokuaiOptionCategories, MokuaiOptionCatType } from '../models/mokuai-option-model';
import { PonentMokuaiOptionsService } from './ponent-mokuai-options.service';
import { MokuaiContext } from '@ponent-mokuai/models/mokuai-context';

@Injectable()
export class PonentMokuaiDataService implements OnDestroy {
  selectedPonents: string[] = [];
  private selectedPonentsStream = new BehaviorSubject<string[]>(this.selectedPonents);
  private currentPonentsSubject: ReplaySubject<ArchNgPonent[]> = new ReplaySubject(1);
  private statusReadyStream = new BehaviorSubject(false);

  constructor(
    private optionService: PonentMokuaiOptionsService,
    private store: ArchNgPonentStore
  ) {
    this.setupStream();
  }

  ngOnDestroy() {}

  setupStream() {
    const source = combineLatest([
      this.getContext(),
      this.getArchNgPonentRelationshipTypes(),
      this.getSelectedPonents()
    ]);

    source
      .pipe(
        filter(([ context, relationTypes, selectedPonents ]: [ MokuaiContext, RelationshipType[], string[] ]) => {
          return !!selectedPonents;
        }),
        tap(([ context, relationTypes, selectedPonents ]: [ MokuaiContext, RelationshipType[], string[] ]) => {
          this.statusReadyStream.next(false);
          const { viewerId } = context;
          const hostPonentName = first(selectedPonents);

          if (hostPonentName !== viewerId) {
            this.selectedPonents.length = 0;
            this.appendSelectedPonent(viewerId);
          }
        }),
        filter(([ context ]) => {
          const { ngPonentType, viewerId } = context;
          return viewerId && (viewerId === 'Overview' || ClassLevelPonentTypes.includes(ngPonentType));
        }),
        debounceTime(0),
        mergeMap(([ context, relationTypes, selectedPonents ]: [ MokuaiContext, RelationshipType[], string[] ]) => {
          const { viewerId } = context;
          const ponentName = last(selectedPonents);

          return viewerId === 'Overview'
            ? this.store.getRootModulesOfLoadingGroup()
            : this.store.findPonentAndSpecificDependencies(ponentName || viewerId, relationTypes);

        }),
        takeUntilNgDestroy(this)
      )
      .subscribe( (archNgPonents: ArchNgPonent[]) => {
        this.statusReadyStream.next(true);
        this.currentPonentsSubject.next(archNgPonents);
      });
  }

  getContext(): Observable<MokuaiContext> {
    return this.optionService.getContext();
  }

  getLatestViewerDataAndOptions(): Observable<[ArchNgPonent | ArchNgPonent[], MokuaiOptionCategories, MokuaiContext]> {
    return combineLatest([
      this.currentPonentsSubject.asObservable(),
      this.optionService.getOptionCategories(),
      this.getContext()
    ]).pipe(
      tap(() => this.statusReadyStream.next(true)),
      debounceTime(0)
    );
  }

  checkStatusReady(): Observable<boolean> {
    return this.statusReadyStream.asObservable();
  }

  getSelectedPonents(): Observable<string[]> {
    return this.selectedPonentsStream.asObservable();
  }


  appendSelectedPonent(ponentName: string) {
    const lastPonent = last(this.selectedPonents);

    if (lastPonent !== ponentName) {
      this.selectedPonents.push(ponentName);

      this.selectedPonentsStream.next(this.selectedPonents);
    }
  }

  popSelectedPonent(ponentName: string): boolean {
    let result = false;

    const index = this.selectedPonents.indexOf(ponentName) + 1;
    if (index > 0 && index < this.selectedPonents.length) {
      this.selectedPonents.splice(index);

      this.selectedPonentsStream.next(this.selectedPonents);
      result = true;
    }

    return result;
  }

  // option's type is MokuaiOptionCatType.Relationship
  private getOptionDiagramCategories(): Observable<MetaValue[]> {
    return this.optionService.getOptionCategories()
      .pipe(
        map((categories: MokuaiOptionCategories) => {
          const cat = categories.find(category => category.type === MokuaiOptionCatType.Relationship);
          const items = cat.items.filter(item => item.isUsed && item.isChecked) as UiElementItem[];
          const values: MetaValue[] = items.map(item => item.value);

          return values;
        }),
      );
  }

  private getArchNgPonentRelationshipTypes(): Observable<RelationshipType[]> {
    return this.getOptionDiagramCategories()
      .pipe(
        map((values: MetaValue[]) => {
          const mapTypes = values.map(value => mapOptionToRelationshipType[value]);
          const types: RelationshipType[] = [].concat(...mapTypes);
          return types;
        })
      );
  }
}
