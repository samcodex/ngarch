import { Component, ComponentFactoryResolver, Input, OnInit, ViewContainerRef } from '@angular/core';

import { BoardItem } from '../models/board-item';

@Component({
  selector: 'arch-board-tile',
  templateUrl: './board-tile.component.html',
  styleUrls: ['./board-tile.component.scss']
})
export class BoardTileComponent implements OnInit {

  @Input() item: BoardItem;
  @Input() title: string;
  @Input() note: string;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    public viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit() {
    // const comp = CliCommandComponent;
    // const componentFactory = this.componentFactoryResolver.resolveComponentFactory(comp);

    // this.viewContainerRef.clear();

    // this.viewContainerRef.createComponent(componentFactory);
  }

}
