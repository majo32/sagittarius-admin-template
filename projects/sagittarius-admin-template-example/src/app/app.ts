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
    subtitle: 'Administrator',
  };

  protected readonly menuItems: SgMenuItem[] = [
    { label: 'Dashboard', icon: 'space_dashboard', route: '/dashboard' },
    { label: 'Management', spacer: true },
    { label: 'Users', icon: 'group', route: '/users', badge: 3 },
    { label: 'Form', icon: 'edit_note', route: '/form' },
    { label: 'System', spacer: true },
    { label: 'Settings', icon: 'settings', route: '/settings' },
    { label: 'Empty state', icon: 'inbox', route: '/empty' },
  ];

  protected readonly userMenuItems: SgUserMenuItem[] = [
    { label: 'My profile', icon: 'person', route: '/settings' },
    { label: 'Toggle theme', icon: 'contrast', action: () => this.theme.toggle() },
    { divider: true },
    { label: 'Sign out', icon: 'logout', action: () => this.snackBar.open('Signed out (demo)', 'OK', { duration: 3000 }) },
  ];
}
