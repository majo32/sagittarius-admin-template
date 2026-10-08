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

  protected profile = { name: 'Ján Novák', email: 'jan.novak@example.com', language: 'sk', timezone: 'Europe/Bratislava' };

  protected notifications = [
    { key: 'orders', label: 'Nové objednávky', description: 'E-mail pri každej novej objednávke', enabled: true },
    { key: 'weekly', label: 'Týždenný súhrn', description: 'Prehľad výkonu každý pondelok ráno', enabled: true },
    { key: 'security', label: 'Bezpečnostné upozornenia', description: 'Prihlásenie z nového zariadenia', enabled: true },
    { key: 'marketing', label: 'Novinky produktu', description: 'Informácie o nových funkciách', enabled: false },
  ];

  protected save() {
    this.snackBar.open('Nastavenia boli uložené', 'OK', { duration: 3000 });
  }
}
