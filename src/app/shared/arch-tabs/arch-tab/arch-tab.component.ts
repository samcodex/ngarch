import { AfterContentChecked, Component, HostBinding, Input, OnInit } from '@angular/core';

const themes = ['panel', 'workspace'];

@Component({
  selector: 'arch-tab',
  template: '<div class="arch-tab-content"><ng-content></ng-content></div>',
  styleUrls: ['./arch-tab.component.scss']
})
export class ArchTabComponent implements OnInit, AfterContentChecked {
  @HostBinding('class.active')
  @Input() active = false;

  @Input() caption: string;
  @Input() disabled = false;
  @Input() used = true;
  @Input() data: any;

  @Input() theme: string;

  @HostBinding('class.panel-tab') themePanelTab;
  @HostBinding('class.workspace-tab') themeWorkspaceTab;

  private isThemeDynamicChanged = false;

  constructor() { }

  ngOnInit() {
    this.themePanelTab = this.theme === 'panel';
    this.themeWorkspaceTab = this.theme === 'workspace';
  }

  updateTheme(theme: string) {
    this.theme = theme;
    this.isThemeDynamicChanged = true;
  }

  ngAfterContentChecked() {
    if (this.isThemeDynamicChanged) {
      this.updateThemeCss();
    }
  }

  private updateThemeCss() {
    this.themePanelTab = this.theme === 'panel';
    this.themeWorkspaceTab = this.theme === 'workspace';
    this.isThemeDynamicChanged = false;
  }
}
