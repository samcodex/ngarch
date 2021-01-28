import { Component, OnInit, ViewContainerRef, ElementRef, ViewEncapsulation,
  AfterViewInit, Input } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'ngx-flow-panel',
  templateUrl: './flow-panel.component.html',
  styleUrls: ['./flow-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FlowPanelComponent implements OnInit {
  @Input() title: string;
  @Input() constraintAreaId: string;
  isExpanded = true;

  constructor(
    private elementRef: ElementRef,
    public viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit() {
  }

  onResizeEnd(event: ResizeEvent): void {
    // console.log('Element was resized', event);
  }

  get expandIcon(): string {
    return this.isExpanded ? 'expand_less' : 'expand_more';
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }
}
