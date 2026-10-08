import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/** 404 a ukážka prázdneho stavu (route data `empty: true`). */
@Component({
  selector: 'app-not-found',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  template: `
    <div class="sg-page">
      <section class="sg-card">
        @if (empty()) {
          <div class="sg-empty-state">
            <mat-icon>inbox</mat-icon>
            <h3>Nothing here yet</h3>
            <p>This is what an empty list looks like. Add the first record and it will show up here.</p>
            <a matButton="filled" routerLink="/form"><mat-icon>add</mat-icon> Create record</a>
          </div>
        } @else {
          <div class="sg-empty-state">
            <mat-icon>explore_off</mat-icon>
            <h3>Page not found</h3>
            <p>The address you are looking for does not exist or has been moved.</p>
            <a matButton="filled" routerLink="/dashboard">Back to dashboard</a>
          </div>
        }
      </section>
    </div>
  `,
})
export class NotFound {
  /** Z route data (withComponentInputBinding). */
  readonly empty = input(false);
}
