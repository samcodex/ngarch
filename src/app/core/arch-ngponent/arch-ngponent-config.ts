import { NgPonentType, TsPonentType } from '../ngponent-tsponent';
import { ArchNgPonentComponent } from './arch-ngponent-component';
import { ArchNgPonentDirective } from './arch-ngponent-directive';
import { ArchNgPonentInjectable } from './arch-ngponent-injectable';
import { ArchNgPonentModel } from './arch-ngponent-model';
import { ArchNgPonentModule } from './arch-ngponent-module';
import { ArchNgPonentModuleWithProvider } from './arch-ngponent-modulewithprovider';
import { ArchNgPonentPipe } from './arch-ngponent-pipe';
import { ArchNgPonentRoutes } from './arch-ngponent-routes';

// NgPonentType.NgModule,
// NgPonentType.Component,
// NgPonentType.Directive,
// NgPonentType.Injectable,
// NgPonentType.Pipe,
export type ModuleTypeNgPonent = ArchNgPonentModule | ArchNgPonentComponent | ArchNgPonentDirective |
  ArchNgPonentInjectable | ArchNgPonentPipe | ArchNgPonentModuleWithProvider;

export const ArchNgPonentClassMapping: {[key: string]: any} = {
  [NgPonentType.NgModule]: ArchNgPonentModule,
  [NgPonentType.Component]: ArchNgPonentComponent,
  [NgPonentType.Directive]: ArchNgPonentDirective,
  [NgPonentType.Injectable]: ArchNgPonentInjectable,
  [NgPonentType.Pipe]: ArchNgPonentPipe,
  [TsPonentType.ClassPonent]: ArchNgPonentModel,
  [NgPonentType.Routes]: ArchNgPonentRoutes,
  [NgPonentType.ModuleWithProviders]: ArchNgPonentModuleWithProvider
};
