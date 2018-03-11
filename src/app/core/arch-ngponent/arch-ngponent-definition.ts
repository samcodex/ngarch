import { ArchNgPonentRoutes } from './arch-ngponent-routes';
import { ArchNgPonentPipe } from './arch-ngponent-pipe';
import { ArchNgPonentDirective } from './arch-ngponent-directive';
import { ArchNgPonentInjectable } from './arch-ngponent-injectable';
import { ArchNgPonentComponent } from './arch-ngponent-component';
import { ArchNgPonentModule } from './arch-ngponent-module';
import { NgPonentType, NgPonentFeature, TsPonentType } from '../ngponent-tsponent';
import { ArchNgPonentModel } from './arch-ngponent-model';

// NgPonentType.NgModule,
// NgPonentType.Component,
// NgPonentType.Directive,
// NgPonentType.Injectable,
// NgPonentType.Pipe,
// NgPonentType.Model
export type ModuleTypeNgPonent = ArchNgPonentModule | ArchNgPonentComponent | ArchNgPonentDirective |
  ArchNgPonentInjectable | ArchNgPonentModel | ArchNgPonentPipe;

export const ArchNgPonentClassMapping: {[key: string]: any} = {
  [NgPonentType.NgModule]: ArchNgPonentModule,
  [NgPonentType.Component]: ArchNgPonentComponent,
  [NgPonentType.Directive]: ArchNgPonentDirective,
  [NgPonentType.Injectable]: ArchNgPonentInjectable,
  [NgPonentType.Pipe]: ArchNgPonentPipe,
  [TsPonentType.ClassPonent]: ArchNgPonentModel,
  [NgPonentType.Route]: ArchNgPonentRoutes
};
