import { Injectable } from '@angular/core';
import { IReloadable } from './reloadable.interface';

@Injectable()
export class ReloadRegisterService {
  private loaders: IReloadable[] = [];

  constructor() { }

  register(loader: IReloadable) {
    this.loaders.push(loader);
  }

  reload() {
    this.loaders.forEach(loader => loader.reload());
  }
}
