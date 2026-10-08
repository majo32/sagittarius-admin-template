import { AfterViewInit, Component, HostListener, OnInit, ViewChild, computed, inject, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { DrawerComponent } from './drawer-component/drawer-component';
import { DrawerService } from './drawer-service';
import { SG_ADMIN_LABELS } from './sagittarius-admin.labels';
import { SgMenuItem, SgUser, SgUserMenuItem } from './sagittarius-admin.models';

const MOBILE_BREAKPOINT = 800;
const COLLAPSED_STORAGE_KEY = 'sg-admin-sidebar-collapsed';

@Component({
  selector: 'lib-sagittarius-admin',
  imports: [
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    DrawerComponent,
  ],
  templateUrl: './sagittarius-admin.html',
  styleUrl: './sagittarius-admin.scss'
})
export class SagittariusAdmin implements OnInit, AfterViewInit {
  /** Názov aplikácie v hlavičke sidebaru. */
  readonly appTitle = input('Sagittarius');
  /** Skratka zobrazená v zbalenom sidebare (default: iniciály z `appTitle`). */
  readonly appShortTitle = input<string>();
  /** URL loga; bez neho sa zobrazí farebný štvorec so skratkou. */
  readonly logoUrl = input<string>();
  /** Routa, kam vedie klik na logo. */
  readonly homeRoute = input<string | any[]>('/');
  readonly menuItems = input<SgMenuItem[]>([]);
  readonly user = input<SgUser | null>(null);
  readonly userMenuItems = input<SgUserMenuItem[]>([]);
  /** Pamätať si zbalenie sidebaru v localStorage. */
  readonly persistSidebarState = input(true);

  /** Emituje sa pri kliknutí na položku user menu (popri jej `action`). */
  readonly userMenuItemClick = output<SgUserMenuItem>();

  /** Texty layoutu (`provideSgAdminLabels`). */
  protected readonly labels = inject(SG_ADMIN_LABELS);

  readonly isHandset = signal(false);
  readonly sidebarOpen = signal(false);
  readonly sidebarCollapsed = signal(false);
  readonly hovered = signal(false);
  readonly drawerOpen = signal(false);
  private noHover = false;

  /** Zbalenie platí len na desktope, na mobile je sidebar vždy v plnej šírke. */
  readonly collapsed = computed(() => this.sidebarCollapsed() && !this.isHandset());

  readonly shortTitle = computed(() => this.appShortTitle() ?? initials(this.appTitle()));
  readonly userInitials = computed(() => {
    const user = this.user();
    return user ? user.initials ?? initials(user.name) : '';
  });

  @ViewChild(DrawerComponent) drawerComponent!: DrawerComponent;

  constructor(private drawerService: DrawerService) { }

  ngOnInit(): void {
    if (this.persistSidebarState()) {
      this.sidebarCollapsed.set(readStorage(COLLAPSED_STORAGE_KEY) === 'true');
    }
    this.calculateWidth();
  }

  ngAfterViewInit(): void {
    this.drawerService.setHost(this.drawerComponent, this);
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateWidth();
  }

  openSidebar() {
    this.sidebarOpen.set(true);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  toggleSidebar() {
    this.sidebarCollapsed.update(v => !v);
    if (this.persistSidebarState()) {
      writeStorage(COLLAPSED_STORAGE_KEY, String(this.sidebarCollapsed()));
    }
    // Po prepnutí krátko ignorujeme hover, aby sa sidebar hneď znova nerozbalil
    this.noHover = true;
    this.hovered.set(false);
    setTimeout(() => this.noHover = false, 300);
  }

  setHovered(value: boolean) {
    if (!this.noHover) {
      this.hovered.set(value);
    }
  }

  onNavigate() {
    if (this.isHandset()) {
      this.closeSidebar();
    }
  }

  onUserMenuItem(item: SgUserMenuItem) {
    item.action?.();
    this.userMenuItemClick.emit(item);
  }

  openDrawer() {
    this.drawerOpen.set(true);
  }

  closeDrawer() {
    this.drawerOpen.set(false);
  }

  private calculateWidth() {
    const handset = window.innerWidth <= MOBILE_BREAKPOINT;
    this.isHandset.set(handset);
    if (!handset) {
      this.sidebarOpen.set(false);
    }
  }
}

function initials(text: string): string {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]!.toUpperCase())
    .join('');
}

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // localStorage nemusí byť dostupný (privátny režim, SSR)
  }
}
