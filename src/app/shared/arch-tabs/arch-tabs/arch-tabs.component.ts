import { Component, OnInit, ContentChildren, QueryList, AfterContentInit, Input, EventEmitter, Output, HostBinding, AfterContentChecked } from '@angular/core';

import { ArchTabComponent } from '@shared/arch-tabs/arch-tab/arch-tab.component';

const themes = ['panel', 'workspace'];
const defaultTheme = themes[0];
const cssClasses = [ 'panel-tabs', 'workspace-tabs' ];
const getClass = (theme: string) => cssClasses[themes.indexOf(theme) === -1 ? 0 : themes.indexOf(theme)];

const captionThemes = [ 'panel-caption', 'workspace-caption' ];

@Component({
  selector: 'arch-tabs',
  templateUrl: './arch-tabs.component.html',
  styleUrls: ['./arch-tabs.component.scss']
})
export class ArchTabsComponent implements OnInit, AfterContentInit {

  @Input() theme = 'panel'; // 'workspace' | 'panel'
  @Input() singlePanel = false;
  @Output() navigate = new EventEmitter();

  @HostBinding('class') cssClass = getClass(this.theme); // 'workspace-tabs' | 'panel-tabs'

  @ContentChildren(ArchTabComponent) archTabComponents: QueryList<ArchTabComponent>;

  archTabsHost = new ArchTabsHost();

  constructor() { }

  get tabCaptionClass() {
    const index = themes.indexOf(this.theme);
    return captionThemes[index];
  }

  ngOnInit() {
    this.theme = this.theme || defaultTheme;
    if (!themes.includes(this.theme)) {
      this.theme = defaultTheme;
    }

    this.cssClass = getClass(this.theme);
  }

  ngAfterContentInit() {
    this.archTabComponents.forEach(com => {
      com.updateTheme(this.theme);

      if (com.used) {
        this.archTabsHost.addTab(new ArchTab(com));
      }
    });

    if (!this.archTabsHost.hasActiveTab) {
      this.archTabsHost.activateFirstTab();
    }
  }

  get archTabs() {
    return this.archTabsHost.archTabs;
  }

  onSelectTab(archTab: ArchTab) {
    if (this.archTabsHost.activeTab !== archTab) {
      this.archTabsHost.activateTab(archTab);
      this.navigate.emit(archTab.data);
    }
  }
}

class ArchTabsHost {
  archTabs: ArchTab[] = [];
  activeTab: ArchTab;

  addTab(archTab: ArchTab) {
    if (archTab.active) {
      if (this.hasActiveTab) {
        archTab.inactivate();
      } else {
        this.activeTab = archTab;
      }
    }

    this.archTabs.push(archTab);
  }

  get hasActiveTab() {
    return !!this.activeTab;
  }

  activateFirstTab() {
    const [ firstTab ] = this.archTabs;

    if (this.activeTab !== firstTab) {
      this.activateTab(firstTab);
    }
  }

  activateTab(tab: ArchTab) {
    this.archTabs.forEach(archTab => {
      if (archTab === tab) {
        archTab.activate();
        this.activeTab = archTab;
      } else {
        archTab.inactivate();
      }
    });
  }
}

class ArchTab {
  caption: string;
  active: boolean;
  disabled: boolean;
  data: any;

  constructor(private archTabComponent: ArchTabComponent) {
    this.caption = this.archTabComponent.caption;
    this.active = this.archTabComponent.active;
    this.disabled = this.archTabComponent.disabled;
    this.data = this.archTabComponent.data;
  }

  activate() {
    this.active = this.archTabComponent.active = true;
  }

  inactivate() {
    this.active = this.archTabComponent.active = false;
  }
}
