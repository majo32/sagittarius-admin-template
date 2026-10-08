import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsersStore } from '../../core/users.store';
import { UserForm } from '../user-form/user-form';

/**
 * Formulár používateľa ako samostatná stránka – `/users/new` a `/users/:userId/edit`.
 * Otvára ju ikona v hlavičke drawera (`DrawerOptions.fullPageUrl`).
 */
@Component({
  selector: 'app-user-form-page',
  imports: [RouterLink, MatButtonModule, MatIconModule, UserForm],
  template: `
    <div class="sg-page sg-page-narrow">
      <div class="sg-page-header">
        <div>
          <nav class="sg-breadcrumbs">
            <a routerLink="/dashboard">Home</a>
            <span>Management</span>
            <a routerLink="/users">Users</a>
            @if (user(); as u) {
              <a [routerLink]="['/users', u.id]">{{ u.firstName }} {{ u.lastName }}</a>
            }
          </nav>
          <h1 class="sg-page-title">{{ isNew() ? 'New user' : 'Edit user' }}</h1>
        </div>
      </div>

      @if (isNew() || user()) {
        <app-user-form [user]="user()" />
      } @else {
        <section class="sg-card">
          <div class="sg-empty-state">
            <mat-icon>person_off</mat-icon>
            <h3>User not found</h3>
            <p>No user with ID {{ userId() }} exists.</p>
            <a matButton="filled" routerLink="/users">Back to list</a>
          </div>
        </section>
      }
    </div>
  `,
})
export class UserFormPage {
  private readonly store = inject(UsersStore);

  /** Z route parametra (withComponentInputBinding); pri `/users/new` chýba. */
  readonly userId = input<number | undefined, unknown>(undefined, {
    transform: (v: unknown) => (v == null ? undefined : Number(v)),
  });
  protected readonly isNew = computed(() => this.userId() === undefined);
  protected readonly user = computed(() => this.store.users().find(u => u.id === this.userId()));
}
