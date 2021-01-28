import { Component, AfterViewInit, Input, Renderer2, ElementRef } from '@angular/core';
import 'prismjs/prism';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-sass';
import 'prismjs/components/prism-scss';

declare var Prism: any;

@Component({
  selector: 'arch-prism-coder',
  template: '',
})
export class PrismCoderComponent implements AfterViewInit {

  @Input() code: string;
  @Input() language: string;
  private preNode: Node;
  private codeNode: Node;
  private nativeElement: Node;

  constructor(private _renderer: Renderer2, private _el: ElementRef) {
    this.nativeElement = _el.nativeElement;
  }

  ngAfterViewInit () {
    this.preNode = this._renderer.createElement('pre');
    this.codeNode = this._renderer.createElement('code');
    this._renderer.addClass(this.codeNode, 'language-' + this.language);
    this._renderer.appendChild(this.nativeElement, this.preNode);
    this._renderer.appendChild(this.preNode, this.codeNode);
    this.codeNode.textContent = this.code;
    Prism.highlightElement(this.codeNode);
  }
}
