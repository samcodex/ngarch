import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

import { NavigationItem } from './../core/navigation-item-type';
import { ArchNavigationItems } from './../arch-navigation-setting';

@Component({
  selector: 'arch-arch-navigation',
  templateUrl: './arch-navigation.component.html',
  styleUrls: ['./arch-navigation.component.scss']
})
export class ArchNavigationComponent implements OnInit {

  items: NavigationItem[] = ArchNavigationItems;

  constructor(
    private router: Router
  ) {
  }

  ngOnInit() {
    const path = window.location.pathname;
    const selectedItem = this.items.find( item => '/' + item.path === path);

    if (selectedItem) {
      this.changeItemState(selectedItem);
    }
  }

  selectItem(selectedItem: NavigationItem) {
    this.changeItemState(selectedItem);

    const path = selectedItem.path;
    if (path) {
      this.router.navigate([`/${selectedItem.path}`]);
    }
  }

  private changeItemState(selectedItem: NavigationItem) {
    this.items.forEach( item => item.isSelected = false);
    selectedItem.isSelected = true;
  }
}
