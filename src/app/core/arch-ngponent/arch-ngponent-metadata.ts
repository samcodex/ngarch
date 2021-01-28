import { Component, Directive, Injectable, NgModule, Pipe } from '@angular/core';
import { Route } from '@angular/router';

import { RelationshipType } from '../arch-relationship';
import { TsPonentType } from '../ngponent-tsponent';
import { NgPonentType } from '../ngponent-tsponent/ngponent-definition';
import { TsPonent } from '../ngponent-tsponent/tsponent';

export type MetadataType = NgModule | Component | Directive | Injectable | Pipe | Route;

export enum ArchNgPonentMetadataKeys {
  Ctor = 'ctor',
  Template = 'Template'
}

export abstract class ArchNgPonentMetadata {
  ngPonentType: NgPonentType;
  properties: string[];
  usedProperties: string[];
  descriptions: {};

  metadata: MetadataType;
  relationships?: {[key: string]: RelationshipType};
  __metaRefs?: { [ key in string ]: TsPonent[]};

  listMetadataWithString(): {[key: string]: string } {
    const archMetadata = {};
    const metadata = this.metadata;

    this.usedProperties.forEach(property => {
      const metaValues: Array<string | TsPonent> = metadata[property];

      archMetadata[property] = metaValues.map(meta => {
        let metaText = null;

        if (typeof meta === 'string') {
          metaText = meta;
        } else if (meta instanceof TsPonent) {
          if (meta.ponentType === TsPonentType.CallExpressionPonent) {
            metaText = meta.name + '()' === meta.value ? meta.value : meta.name + '(...)';
          } else if (meta.ponentType === TsPonentType.ObjectExpressionPonent) {
            metaText = '{';
            meta.members.forEach((member, index) => {
              if (index >= 1) {
                metaText += ', ';
              }
              metaText += `${member.name}:${member.value}`;
            });
            metaText += '}';
          }
        }
        return metaText;
      });
    });

    return archMetadata;
  }

  appendMetaRefs(key: string, tsPonent: TsPonent) {
    if (!this.__metaRefs) {
      this.__metaRefs = {};
    }
    const refs = this.__metaRefs;
    if (key in refs) {
      refs[key].push.apply(refs[key], tsPonent );
    } else {
      refs[key] = [ tsPonent ];
    }
  }
}
