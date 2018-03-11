import { Injectable } from '@angular/core';
import { ArchNgPonentStore } from './../../shared/services/arch-ngponent-store/arch-ngponent-store';

@Injectable()
export class ServiceDependencyDataService {

  constructor(
    private store: ArchNgPonentStore
  ) { }

  getAllServices() {
    return this.store.getAllServiceNgPonents();
  }
}
