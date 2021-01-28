import { Injectable } from '@angular/core';
import { ArchNgPonentStore } from '../../shared/arch-ngponent-store';

@Injectable()
export class ServiceDependencyDataService {

  constructor(
    private store: ArchNgPonentStore
  ) { }

  getAllServices() {
    return this.store.getAllServicesFromModuleTypePonents();
  }
}
