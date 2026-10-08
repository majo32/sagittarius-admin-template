import { InjectionToken, Provider } from '@angular/core';

/** Texty zabudované v layoute (aria-label, tooltipy). */
export interface SgAdminLabels {
  /** Otvorenie sidebaru hamburgerom na mobile. */
  openMenu: string;
  /** Zatvorenie sidebaru na mobile. */
  closeMenu: string;
  /** Pripnutie (rozbalenie) zbaleného sidebaru. */
  expandMenu: string;
  /** Zbalenie sidebaru. */
  collapseMenu: string;
  /** Tlačidlo používateľského menu v hlavičke. */
  userMenu: string;
  /** Zatvorenie prvej vrstvy drawera. */
  drawerClose: string;
  /** Návrat z vnorenej vrstvy drawera. */
  drawerBack: string;
  /** Predvolený tooltip / aria-label ikony `fullPageUrl` (prebije ho `DrawerOptions.fullPageLabel`). */
  drawerFullPage: string;
}

/** Anglické texty (predvolené). */
export const SG_ADMIN_LABELS_EN: SgAdminLabels = {
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  expandMenu: 'Pin menu',
  collapseMenu: 'Collapse menu',
  userMenu: 'User menu',
  drawerClose: 'Close',
  drawerBack: 'Back',
  drawerFullPage: 'Open as full page',
};

/** Slovenské texty. */
export const SG_ADMIN_LABELS_SK: SgAdminLabels = {
  openMenu: 'Otvoriť menu',
  closeMenu: 'Zavrieť menu',
  expandMenu: 'Pripnúť menu',
  collapseMenu: 'Zbaliť menu',
  userMenu: 'Používateľské menu',
  drawerClose: 'Zavrieť',
  drawerBack: 'Späť',
  drawerFullPage: 'Otvoriť na celej stránke',
};

/** Texty layoutu; default `SG_ADMIN_LABELS_EN`. Nastav cez `provideSgAdminLabels()`. */
export const SG_ADMIN_LABELS = new InjectionToken<SgAdminLabels>('SG_ADMIN_LABELS', {
  providedIn: 'root',
  factory: () => SG_ADMIN_LABELS_EN,
});

/**
 * Nastaví texty layoutu. Chýbajúce kľúče sa doplnia z angličtiny.
 *
 * ```ts
 * providers: [provideSgAdminLabels(SG_ADMIN_LABELS_SK)]
 * providers: [provideSgAdminLabels({ drawerClose: 'Schließen' })]
 * ```
 */
export function provideSgAdminLabels(labels: Partial<SgAdminLabels>): Provider {
  return { provide: SG_ADMIN_LABELS, useValue: { ...SG_ADMIN_LABELS_EN, ...labels } };
}
