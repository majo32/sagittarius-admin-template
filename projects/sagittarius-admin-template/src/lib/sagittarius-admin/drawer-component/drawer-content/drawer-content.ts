import { Component, ComponentRef, Injector, Type, ViewChild, ViewContainerRef, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { DrawerRef } from '../../drawer-ref';

@Component({
  selector: 'lib-drawer-content',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterLink,
  ],
  templateUrl: './drawer-content.html',
  styleUrl: './drawer-content.scss'
})
export class DrawerContent {
  @ViewChild('vc', { read: ViewContainerRef, static: true }) vc!: ViewContainerRef;

  readonly pos = input(0);
  readonly drawerRef = input.required<DrawerRef>();
  readonly fullPageIcon = input('open_in_full');
  readonly fullPageLabel = input('Otvoriť na celej stránke');
  readonly animating = signal(true);

  loadComponent<T>(component: Type<T>, injector: Injector): ComponentRef<T> {
    this.vc.clear();
    return this.vc.createComponent(component, { injector });
  }

  onAnimationEnd(event: AnimationEvent) {
    // animationend bubble-uje aj z obsahu – reaguj len na vlastnú animáciu
    if (event.target === event.currentTarget) {
      this.animating.set(false);
    }
  }

  close() {
    this.drawerRef().close();
  }
}
