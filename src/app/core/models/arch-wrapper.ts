
export class ArchWrapper<T, S> {
  parent: T;
  children: S[];
  label: string;

  constructor(parent: T, label?: string) {
    this.parent = parent;
    this.children = [];
    this.label = label;
  }

  get firstChild(): S {
    return this.children[0];
  }

  appendChild(ponent: S) {
    this.children.push(ponent);
  }
}
