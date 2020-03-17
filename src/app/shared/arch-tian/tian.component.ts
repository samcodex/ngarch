import { Component, OnInit, Input, ElementRef, ViewChild, EventEmitter, Output } from '@angular/core';
import { animate, style, transition, trigger, state } from '@angular/animations';
import { Observable, BehaviorSubject, never } from 'rxjs';
import { fromEvent } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const minWidth = 15;

@Component({
  selector: 'arch-tian',
  templateUrl: './tian.component.html',
  styleUrls: ['./tian.component.scss'],
  animations: [
    trigger('toggleRightPanel', [
      // state('expanded', style({ 'min-width': '300px', 'width': '30%', 'visibility': 'visible'})),
      state('collapsed', style({ 'min-width': '0px', 'width': '0px', 'visibility': 'hidden'})),
      transition('* => *', [animate('0.5s')])
    ]),
    trigger('toggleDividerHandler', [
      state('show', style({ 'display': 'flex'})),
      state('hide', style({ 'display': 'none'})),
      transition('* => *', [animate('0.5s')])
    ])
  ]
})
export class TianComponent implements OnInit {
  @Input() isExpanded = true;

  @Input('disableSummary') disableSummary = false;
  @Output() expand = new EventEmitter<{expanded: boolean, delay: number}>();
  @Output() drag = new EventEmitter();
  @Output() stopDrag = new EventEmitter();

  @ViewChild('tianRightPanel', {static: false}) private tianRightPanel: ElementRef ;

  private startX = 0;
  private startWidth = 0;

  // dividerHandler
  private dividerHandler;
  private handler$: Observable<any>;
  private dividerTrigger = new BehaviorSubject(true);

  constructor(
    private elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.dividerHandler = this.elementRef.nativeElement.querySelector('.divider-handler');
    this.handler$ = fromEvent(this.dividerHandler, 'mousedown');

    this.dividerTrigger.pipe(
      switchMap( flag => flag ? this.handler$ : never())
      )
      .subscribe(this.onMouseDown.bind(this));
  }

  onMouseDown(event: MouseEvent) {
    this.initDrag(event);
  }

  initDrag(event) {
    const nativeElement = this.tianRightPanel.nativeElement;

    const doDrag = (dragEvent: MouseEvent) => {
      const offsetX = this.startX - dragEvent.clientX;
      const newWidth = this.startWidth + offsetX;
      if (newWidth > minWidth) {
        nativeElement.style.width = (this.startWidth + offsetX) + 'px';
      }

      this.drag.emit(dragEvent);
    };

    const stopDrag = (dragEvent: MouseEvent) => {
      document.documentElement.removeEventListener('mousemove', doDrag, false);
      document.documentElement.removeEventListener('mouseup', stopDrag, false);

      this.stopDrag.emit();
    };

    this.startX = event.clientX;
    this.startWidth = parseInt(nativeElement.clientWidth, 10);
    document.documentElement.addEventListener('mousemove', doDrag, false);
    document.documentElement.addEventListener('mouseup', stopDrag, false);
  }

  toggleExpand() {
    this.isExpanded = !this.isExpanded;

    this.dividerTrigger.next(this.isExpanded);
    this.expand.emit({ expanded: this.isExpanded === true, delay: 500});
  }
}
