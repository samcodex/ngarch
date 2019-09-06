import { NgPonentType } from '../ngponent-tsponent';

export const ModuleTypeReferences = [
  NgPonentType.NgModule,
  NgPonentType.Component,
  NgPonentType.Directive,
  NgPonentType.Injectable,
  NgPonentType.Pipe,
  NgPonentType.ModuleWithProviders
];

export const RelationshipWithinNgPonents: NgPonentType[] = [
  NgPonentType.NgModule,  NgPonentType.Component, NgPonentType.Directive, NgPonentType.Injectable,
  NgPonentType.ModuleWithProviders
];

export const RelationshipWithinTsPonents: NgPonentType[] = [
  NgPonentType.Injectable, NgPonentType.Model
];

// Angular feature
export enum ArchPonentFeature {
  RouterModuleForRoot = 'RouterModuleForRoot',          // RouterModule.forRoot
  RouterModuleForChild = 'RouterModuleForChild',        // RouterModule.forChild
}

export enum ArchPonentIssue {
  NoDataType = 'NoDataType'
}
