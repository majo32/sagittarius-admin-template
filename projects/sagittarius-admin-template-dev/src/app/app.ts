import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SagittariusAdmin, SgMenuItem, SgUser, SgUserMenuItem } from 'sagittarius-admin-template';
import { ThemeService } from './core/theme.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatTooltipModule,
    SagittariusAdmin,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly theme = inject(ThemeService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly user: SgUser = {
    name: 'Ján Novák',
    subtitle: 'Administrátor',
  };

  protected readonly menuItems: SgMenuItem[] = [
    { label: 'Prehľad', icon: 'space_dashboard', route: '/dashboard' },
    { label: 'Správa', spacer: true },
    { label: 'Používatelia', icon: 'group', route: '/users', badge: 3 },
    { label: 'Formulár', icon: 'edit_note', route: '/form' },
    { label: 'Systém', spacer: true },
    { label: 'Nastavenia', icon: 'settings', route: '/settings' },
    { label: 'Prázdny stav', icon: 'inbox', route: '/empty' },
  ];

  protected readonly userMenuItems: SgUserMenuItem[] = [
    { label: 'Môj profil', icon: 'person', route: '/settings' },
    { label: 'Prepnúť tému', icon: 'contrast', action: () => this.theme.toggle() },
    { divider: true },
    { label: 'Odhlásiť sa', icon: 'logout', action: () => this.snackBar.open('Odhlásenie (demo)', 'OK', { duration: 3000 }) },
  ];
}
