import { NgPonentType } from './../ngponent-tsponent/ngponent-definition';

export interface IArchNgPonentMetadata {
  ngPonentType: NgPonentType;
  properties: string[];
  usedProperties: string[];
  descriptions?: {};
}
