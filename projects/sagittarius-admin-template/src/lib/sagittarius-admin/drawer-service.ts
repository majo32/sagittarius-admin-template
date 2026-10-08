import { Injectable, Type } from '@angular/core';
import { Location } from '@angular/common';
import type { DrawerComponent } from './drawer-component/drawer-component';
import type { SagittariusAdmin } from './sagittarius-admin';
import { DrawerRef } from './drawer-ref';
import { DrawerData, DrawerOptions } from './sagittarius-admin.models';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  private host?: DrawerComponent;
  private app?: SagittariusAdmin;

  constructor(private location: Location) { }

  setHost(component: DrawerComponent, app: SagittariusAdmin) {
    this.host = component;
    this.app = app;
  }

  /**
   * Otvorí komponent v draweri nad obsahom. Každé ďalšie volanie pridá novú vrstvu.
   * Otvorenie pridá záznam do histórie, takže tlačidlo Späť v prehliadači zatvorí vrchnú vrstvu.
   *
   * @param data vstupy komponentu (signal `input()` aj bežné properties)
   */
  open<T>(
    component: Type<T>,
    data?: DrawerData<T>,
    options?: DrawerOptions
  ): { componentInstance: T, drawerRef: DrawerRef, close: () => void } {
    if (!this.host || !this.app) {
      throw new Error('Drawer host not initialized - <lib-sagittarius-admin> must be rendered');
    }

    const { component: compRef, drawerRef } = this.host.loadComponent(component, data, options);
    this.app.openDrawer();
    this.location.go(this.location.path(true));

    return { componentInstance: compRef.instance, drawerRef, close: () => drawerRef.close() };
  }

  /** Zatvorí vrchnú vrstvu drawera. */
  closeTop() {
    this.location.back();
  }

  /** Zatvorí všetky vrstvy (bez práce s históriou). */
  closeAll() {
    this.host?.closeAll();
  }

  /** @internal volá DrawerComponent, keď zanikne posledná vrstva */
  close() {
    this.app?.closeDrawer();
  }
}
