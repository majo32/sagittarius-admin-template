import { Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DrawerRef, DrawerService } from 'sagittarius-admin-template';
import { STATUS_BADGE, STATUS_LABELS } from '../../core/demo-data';
import { UsersStore } from '../../core/users.store';
import { UserForm } from '../user-form/user-form';

/** Detail používateľa – zobrazuje sa v draweri (DrawerService.open) aj na samostatnej stránke (UserPage). */
@Component({
  selector: 'app-user-detail',
  imports: [DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.scss'
})
export class UserDetail {
  private readonly drawer = inject(DrawerService);
  /** `null`, ak detail nie je v draweri (samostatná stránka). */
  protected readonly drawerRef = inject(DrawerRef, { optional: true });
  private readonly store = inject(UsersStore);

  readonly userId = input.required<number>();
  protected readonly user = computed(() => this.store.users().find(u => u.id === this.userId()));

  protected readonly statusLabels = STATUS_LABELS;
  protected readonly statusBadge = STATUS_BADGE;

  protected readonly permissions = [
    { module: 'Objednávky', read: true, write: true },
    { module: 'Faktúry', read: true, write: false },
    { module: 'Používatelia', read: true, write: false },
    { module: 'Nastavenia', read: false, write: false },
  ];

  protected edit() {
    const u = this.user()!;
    // Druhá vrstva drawera – šípka späť sa vráti na detail
    this.drawer.open(UserForm, { user: u }, {
      title: `Upraviť: ${u.firstName} ${u.lastName}`,
      fullPageUrl: ['/users', u.id, 'edit'],
    });
  }
}
