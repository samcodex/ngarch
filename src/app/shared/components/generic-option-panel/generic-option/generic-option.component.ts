import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { UiElementData, UiElementCategory, UiElementSection, traverseUiElementData, assignCategorySelectedItem } from '@core/models/ui-element-category';
import { UiElementItem } from '@core/models/ui-element-item';

interface OptionChangedType {
  section: UiElementSection;
  category: UiElementCategory;
  option: UiElementItem;
}

@Component({
  selector: 'arch-generic-option',
  templateUrl: './generic-option.component.html',
  styleUrls: ['./generic-option.component.scss']
})
export class GenericOptionComponent implements OnInit {
  @Input()
  optionData: UiElementData;

  @Output()
  optionChanged: EventEmitter<OptionChangedType> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    traverseUiElementData(this.optionData, {category: assignCategorySelectedItem()});
  }

  isSection(section: UiElementSection): boolean {
    return !!section.categories;
  }

  changeOption(section: UiElementSection, category: UiElementCategory, item?: UiElementItem) {
    this.optionChanged.emit({section, category, option: item || category.selectedItem});
  }
}
