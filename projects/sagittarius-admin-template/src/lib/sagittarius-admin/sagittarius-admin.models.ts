import { InputSignalWithTransform } from '@angular/core';

/** Položka hlavného menu v sidebare. */
export interface SgMenuItem {
  label: string;
  /** Názov Material ikony (ligatúra), napr. `dashboard`. */
  icon?: string;
  /** Cieľová routa pre `routerLink`. */
  route?: string | any[];
  /** `true` = sekčný nadpis (nie je klikateľný). */
  spacer?: boolean;
  /** Presná zhoda pre zvýraznenie aktívnej položky (default `false`). */
  exact?: boolean;
  /** Voliteľný odznak vpravo (napr. počet). */
  badge?: string | number;
}

/** Prihlásený používateľ zobrazený v sidebare a v user menu. */
export interface SgUser {
  name: string;
  /** Druhý riadok pod menom (email, rola…). */
  subtitle?: string;
  avatarUrl?: string;
  /** Ak chýba, vypočíta sa z `name`. */
  initials?: string;
}

/** Položka rozbaľovacieho menu používateľa v hlavičke. */
export interface SgUserMenuItem {
  label?: string;
  icon?: string;
  route?: string | any[];
  action?: () => void;
  disabled?: boolean;
  /** `true` = oddeľovač, ostatné polia sa ignorujú. */
  divider?: boolean;
}

/** Voľby pri otváraní drawera cez `DrawerService.open`. */
export interface DrawerOptions {
  title?: string;
  /**
   * URL samostatnej stránky s rovnakým obsahom (napr. `/users/42` alebo `['/users', 42]`).
   * Ak je zadaná, v pravom rohu hlavičky drawera sa zobrazí ikona, ktorá drawer zavrie
   * a prejde na túto stránku. Dá sa meniť aj za behu cez `DrawerRef.setFullPageUrl()`.
   */
  fullPageUrl?: string | any[];
  /** Material ikona tlačidla (default `open_in_full`). */
  fullPageIcon?: string;
  /** Tooltip / aria-label tlačidla (default „Otvoriť na celej stránke“). */
  fullPageLabel?: string;
}

/**
 * Dáta pre komponent v draweri: vlastnosti komponentu, pričom signal `input()`
 * sa zadáva ako jeho hodnota (nie ako signál).
 */
export type DrawerData<T> = {
  [K in keyof T]?: T[K] extends InputSignalWithTransform<any, infer W> ? W : T[K];
};
