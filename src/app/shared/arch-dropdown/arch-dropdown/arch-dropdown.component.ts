import { Component, ContentChildren, QueryList, AfterContentInit, ViewChild, ElementRef, Renderer2, Input, Output, EventEmitter, Directive, ContentChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Directive({
  selector: '[archDropdownThumbnail]'
})
export class ArchDropdownThumbnailDirective {
  constructor( private elementRef: ElementRef ) { }

  get nativeElement() {
    return this.elementRef.nativeElement;
  }
}


@Directive({
  selector: '[archDropdownOption]'
})
export class ArchDropdownOptionDirective implements AfterContentInit {
  @ContentChild(ArchDropdownThumbnailDirective) thumbnail: ArchDropdownThumbnailDirective;
  thumbnailElement: any = null;
  optionElement: any;

  constructor(
    private elementRef: ElementRef
  ) { }

  ngAfterContentInit() {
    const nativeElement = this.elementRef.nativeElement;

    if (this.thumbnail) {
      this.thumbnailElement = this.thumbnail.nativeElement;
      nativeElement.removeChild(this.thumbnail.nativeElement);
    } else {
      this.thumbnailElement = nativeElement.cloneNode(true);
    }

    this.optionElement  = nativeElement;
  }
}


@Component({
  selector: 'arch-dropdown',
  templateUrl: './arch-dropdown.component.html',
  styleUrls: ['./arch-dropdown.component.scss'],
  animations: [
    trigger('toggleDrapdown', [
      state('expanded', style({ 'max-height': '400px', 'opacity': '1'})),
      state('collapsed', style({ 'max-height': '0px', 'opacity': '0'})),
      transition('* => *', [animate('0.5s')])
    ])
  ]
})
export class ArchDropdownComponent implements AfterContentInit {

  @ViewChild('dropdownThumbnail') thumbnail: ElementRef;
  @ViewChild('dropdownSelection') selection: ElementRef;
  @ContentChildren(ArchDropdownOptionDirective) contentChildren: QueryList<ArchDropdownOptionDirective>;

  @Input() selectedIndex: number = null;
  @Input() thumbnailHeight = '40px';
  @Input() zIndex = '1';
  @Input() autoExpand = false;
  @Output() select: EventEmitter<number> = new EventEmitter();

  thumbnailElements: any[] = [];
  optionElements: any[] = [];
  currentThumbnail = null;

  expanded = true;

  constructor( private renderer: Renderer2 ) { }

  ngAfterContentInit(): void {
    const renderer = this.renderer;

    this.initComponentElement();

    this.contentChildren.forEach((content, index) => {
      // option
      const divOption = this.renderer.createElement('div');

      // divOption
      this.setCssClass(divOption, this.selectedIndex && this.selectedIndex === index);
      renderer.listen(divOption, 'click', this.onSelect.bind(this, divOption, index));

      // append elements
      renderer.appendChild(divOption, content.optionElement);
      renderer.appendChild(this.selection.nativeElement, divOption);

      // keep the elements;
      this.optionElements.push(divOption);
      this.thumbnailElements.push(content.thumbnailElement);
    });
  }

  expand() {
    this.expanded = !this.expanded;
  }

  onSelect(option, index: number) {
    if (this.selectedIndex === index) {
      return;
    }

    this.selectedIndex = index;
    this.optionElements.forEach((element, idx) => {
      this.setCssClass(element, index === idx);
    });

    this.renderThumbnail();

    if (this.autoExpand) {
      this.expand();
    }
    this.select.emit(index);
  }

  private renderThumbnail() {
    const renderer = this.renderer;

    const thumbnail = this.thumbnailElements[this.selectedIndex];
    const divThumbnail = this.renderer.createElement('div');

    if (this.currentThumbnail) {
      renderer.removeChild(this.thumbnail.nativeElement, this.currentThumbnail);
    }
    renderer.appendChild(divThumbnail, thumbnail);
    renderer.appendChild(this.thumbnail.nativeElement, divThumbnail);
    this.currentThumbnail = divThumbnail;
  }

  private setCssClass(element, isSelected = false) {
    const selectedClass = isSelected ? ' selected' : '';
    const cssClasses =  `dropdown-option${selectedClass}`;

    this.renderer.setAttribute(element, 'class', cssClasses);
  }

  private initComponentElement() {
    const renderer = this.renderer;

    if (this.thumbnailHeight) {
      renderer.setStyle(this.thumbnail.nativeElement, 'height', this.thumbnailHeight);
    }

    if (this.zIndex) {
      renderer.setStyle(this.thumbnail.nativeElement, 'z-index', this.zIndex);
    }
  }
}
