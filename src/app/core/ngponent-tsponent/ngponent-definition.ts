import { NgPonent } from './ngponent';
import { TsPonent } from './tsponent';

export type Ponent = NgPonent | TsPonent;

export enum NgPonentType {
  Attribute = 'Attribute',
  Component = 'Component',
  ContentChild = 'ContentChild',
  ContentChildren = 'ContentChildren',
  Directive = 'Directive',
  Host = 'Host',
  HostBinding = 'HostBinding',
  HostListener = 'HostListener',
  Inject = 'Inject',
  Injectable = 'Injectable',
  Input = 'Input',
  NgModule = 'NgModule',
  Optional = 'Optional',
  Output = 'Output',
  Pipe = 'Pipe',
  Self = 'Self',
  SkipSelf = 'SkipSelf',
  ViewChild = 'ViewChild',
  ViewChildren = 'ViewChildren',

  _DecoratorEnd = '_DecoratorEnd',

  Model = 'Model',
  Routes = 'Routes',
  Route = 'Route',
  ModuleWithProviders = 'ModuleWithProviders'
}

export const NgDecoratorToPonentType: {[s: string]: NgPonentType} = {
  'Attribute' : NgPonentType.Attribute,
  'Component' : NgPonentType.Component,
  'ContentChild' : NgPonentType.ContentChild,
  'ContentChildren' : NgPonentType.ContentChildren,
  'Directive' : NgPonentType.Directive,
  'Host' : NgPonentType.Host,
  'HostBinding' : NgPonentType.HostBinding,
  'HostListener' : NgPonentType.HostListener,
  'Inject' : NgPonentType.Inject,
  'Injectable' : NgPonentType.Injectable,
  'Input' : NgPonentType.Input,
  'NgModule' : NgPonentType.NgModule,
  'Optional' : NgPonentType.Optional,
  'Output' : NgPonentType.Output,
  'Pipe' : NgPonentType.Pipe,
  'Self' : NgPonentType.Self,
  'SkipSelf' : NgPonentType.SkipSelf,
  'ViewChild' : NgPonentType.ViewChild,
  'ViewChildren' : NgPonentType.ViewChildren
};

export enum NgPonentFeature {
  BootstrapModule = 'BootstrapModule',
  LazyLoading = 'LazyLoading'
}

export const ClassLevelPonentTypes: NgPonentType[] = [
  NgPonentType.NgModule,
  NgPonentType.Component,
  NgPonentType.Directive,
  NgPonentType.Injectable,
  NgPonentType.Pipe
];

export const PonentsRelation: {
  PonentTypesContainComponentsAndServices?: NgPonentType[],
  PonentTypesRelateToAngularLoading?: NgPonentType[]
 } = {};

PonentsRelation.PonentTypesContainComponentsAndServices = [
  NgPonentType.NgModule
];

PonentsRelation.PonentTypesRelateToAngularLoading = [
  NgPonentType.NgModule,
  NgPonentType.Component,
  NgPonentType.Directive,
  NgPonentType.Injectable,
  NgPonentType.Pipe
];

export const PonentTypesWithServiceDependencies: NgPonentType[] = [
  NgPonentType.Component,
  NgPonentType.Directive,
  NgPonentType.Injectable,
  NgPonentType.Pipe
];

export const PonentTypesWithCtorParameters: NgPonentType[] = [
  NgPonentType.Model,
  NgPonentType.Injectable
];
