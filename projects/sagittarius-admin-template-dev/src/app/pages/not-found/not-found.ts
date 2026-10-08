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
            <h3>Zatiaľ tu nič nie je</h3>
            <p>Takto vyzerá prázdny stav zoznamu. Pridajte prvý záznam a zobrazí sa tu.</p>
            <a matButton="filled" routerLink="/form"><mat-icon>add</mat-icon> Vytvoriť záznam</a>
          </div>
        } @else {
          <div class="sg-empty-state">
            <mat-icon>explore_off</mat-icon>
            <h3>Stránka neexistuje</h3>
            <p>Adresa, ktorú hľadáte, neexistuje alebo bola presunutá.</p>
            <a matButton="filled" routerLink="/dashboard">Späť na prehľad</a>
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
