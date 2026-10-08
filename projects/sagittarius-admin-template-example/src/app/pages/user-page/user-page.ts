import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UsersStore } from '../../core/users.store';
import { UserDetail } from '../user-detail/user-detail';

/**
 * Detail používateľa ako samostatná stránka (`/users/:userId`).
 * Otvára ju ikona v hlavičke drawera (`DrawerOptions.fullPageUrl`).
 */
@Component({
  selector: 'app-user-page',
  imports: [RouterLink, MatButtonModule, MatIconModule, UserDetail],
  template: `
    <div class="sg-page">
      <div class="sg-page-header">
        <div>
          <nav class="sg-breadcrumbs">
            <a routerLink="/dashboard">Home</a>
            <span>Management</span>
            <a routerLink="/users">Users</a>
            <span>{{ user() ? user()!.firstName + ' ' + user()!.lastName : 'Unknown' }}</span>
          </nav>
          <h1 class="sg-page-title">User detail</h1>
        </div>
      </div>

      @if (user()) {
        <app-user-detail [userId]="userId()" />
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
export class UserPage {
  private readonly store = inject(UsersStore);

  /** Z route parametra (withComponentInputBinding). */
  readonly userId = input.required({ transform: numberAttribute });
  protected readonly user = computed(() => this.store.users().find(u => u.id === this.userId()));
}
