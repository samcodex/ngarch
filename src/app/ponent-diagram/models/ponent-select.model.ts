import { NgPonentType } from '@core/ngponent-tsponent';
import { ArchNgPonent } from '@core/arch-ngponent';

export interface PonentSelectOptionGroup {
  name: string;
  items: PonentSelectOption[];
}

export interface PonentSelectOption {
  value: string;
  text: string;
  archNgPonent?: ArchNgPonent;
  ngPonentType?: NgPonentType;
  isDisable?: boolean;
  isDefault?: boolean;
}
