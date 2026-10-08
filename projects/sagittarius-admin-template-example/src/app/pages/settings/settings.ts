import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemeService } from '../../core/theme.service';

/** Nastavenia – ukážka stránky so sekciami a prepínačmi. */
@Component({
  selector: 'app-settings',
  imports: [
    FormsModule, MatButtonModule, MatButtonToggleModule, MatFormFieldModule, MatIconModule, MatInputModule,
    MatSelectModule, MatSlideToggleModule,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
  protected readonly theme = inject(ThemeService);
  private readonly snackBar = inject(MatSnackBar);

  protected profile = { name: 'Ján Novák', email: 'jan.novak@example.com', language: 'en', timezone: 'Europe/Bratislava' };

  protected notifications = [
    { key: 'orders', label: 'New orders', description: 'Email on every new order', enabled: true },
    { key: 'weekly', label: 'Weekly summary', description: 'Performance overview every Monday morning', enabled: true },
    { key: 'security', label: 'Security alerts', description: 'Sign-in from a new device', enabled: true },
    { key: 'marketing', label: 'Product news', description: 'Information about new features', enabled: false },
  ];

  protected save() {
    this.snackBar.open('Settings saved', 'OK', { duration: 3000 });
  }
}
