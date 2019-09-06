
export class ArchWrapper<T, S> {
  parent: T;
  children: S[];

  constructor(parent: T) {
    this.parent = parent;
    this.children = [];
  }

  get firstChild(): S {
    return this.children[0];
  }

  appendChild(ponent: S) {
    this.children.push(ponent);
  }
}
