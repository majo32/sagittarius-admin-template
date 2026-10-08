import { Component, ComponentRef, DestroyRef, Injector, Type, ViewChild, ViewContainerRef, inject, reflectComponentType } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { DrawerContent } from './drawer-content/drawer-content';
import { DrawerService } from '../drawer-service';
import { DrawerRef } from '../drawer-ref';
import { DrawerData, DrawerOptions } from '../sagittarius-admin.models';

interface DrawerLayer {
  wrapper: ComponentRef<DrawerContent>;
  component: ComponentRef<unknown>;
  drawerRef: DrawerRef;
}

@Component({
  selector: 'lib-drawer-component',
  imports: [],
  templateUrl: './drawer-component.html',
  styleUrl: './drawer-component.scss'
})
export class DrawerComponent {
  @ViewChild('vc', { read: ViewContainerRef, static: true }) vc!: ViewContainerRef;

  private readonly drawerService = inject(DrawerService);
  private readonly injector = inject(Injector);
  private readonly layers: DrawerLayer[] = [];

  constructor() {
    const location = inject(PlatformLocation);
    const destroyRef = inject(DestroyRef);

    // Späť v prehliadači zatvorí vrchnú vrstvu
    const unlisten = location.onPopState(() => this.close());

    // Navigácia v aplikácii (napr. klik v menu) zatvorí všetky vrstvy
    const sub = inject(Router, { optional: true })?.events
      .pipe(filter((e): e is NavigationStart => e instanceof NavigationStart && e.navigationTrigger === 'imperative'))
      .subscribe(() => this.closeAll());

    destroyRef.onDestroy(() => {
      unlisten();
      sub?.unsubscribe();
      this.layers.forEach(l => l.wrapper.destroy());
    });
  }

  close() {
    const layer = this.layers.pop();
    if (!layer) {
      return;
    }
    layer.wrapper.destroy();
    if (!this.layers.length) {
      this.drawerService.close();
    }
  }

  closeAll() {
    if (!this.layers.length) {
      return;
    }
    while (this.layers.length) {
      this.layers.pop()!.wrapper.destroy();
    }
    this.drawerService.close();
  }

  loadComponent<T>(component: Type<T>, data?: DrawerData<T>, options?: DrawerOptions): { component: ComponentRef<T>, drawerRef: DrawerRef } {
    const drawerRef = new DrawerRef(() => window.history.back());
    drawerRef.setTitle(options?.title ?? '');
    drawerRef.setFullPageUrl(options?.fullPageUrl ?? null);

    const wrapper = this.vc.createComponent(DrawerContent);
    wrapper.setInput('pos', this.layers.length);
    wrapper.setInput('drawerRef', drawerRef);
    if (options?.fullPageIcon) {
      wrapper.setInput('fullPageIcon', options.fullPageIcon);
    }
    if (options?.fullPageLabel) {
      wrapper.setInput('fullPageLabel', options.fullPageLabel);
    }

    const injector = Injector.create({
      providers: [{ provide: DrawerRef, useValue: drawerRef }],
      parent: this.injector,
    });
    const comp = wrapper.instance.loadComponent(component, injector);

    if (data) {
      const inputs = new Set(reflectComponentType(component)?.inputs.map(i => i.templateName) ?? []);
      for (const [key, value] of Object.entries(data)) {
        if (inputs.has(key)) {
          comp.setInput(key, value);
        } else {
          (comp.instance as Record<string, unknown>)[key] = value;
        }
      }
      // Spätná kompatibilita: komponent bez vlastnej metódy close() dostane close z drawera
      if (!('close' in (comp.instance as object))) {
        (comp.instance as Record<string, unknown>)['close'] = () => drawerRef.close();
      }
    }

    this.layers.push({ wrapper, component: comp, drawerRef });
    return { component: comp, drawerRef };
  }
}
