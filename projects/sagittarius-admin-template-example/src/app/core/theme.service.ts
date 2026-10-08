import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'demo-theme';

/** Prepína svetlú/tmavú tému nastavením triedy na <html> (color-scheme). */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly dark = signal(false);

  constructor() {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch { }
    this.set(saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  toggle() {
    this.set(!this.dark());
  }

  set(dark: boolean) {
    this.dark.set(dark);
    document.documentElement.classList.toggle('dark-theme', dark);
    try {
      localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    } catch { }
  }
}
