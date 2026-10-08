import { signal } from '@angular/core';

/**
 * Referencia na otvorený drawer. Komponent zobrazený v draweri ju získa cez `inject(DrawerRef)`.
 */
export class DrawerRef {
  readonly title = signal('');
  /** URL samostatnej stránky; ak je nastavená, hlavička drawera zobrazí ikonu na jej otvorenie. */
  readonly fullPageUrl = signal<string | any[] | null>(null);

  constructor(private readonly closeFn: () => void) {}

  /** Zatvorí tento drawer (krok späť v histórii prehliadača). */
  close(): void {
    this.closeFn();
  }

  setTitle(title: string): void {
    this.title.set(title);
  }

  /** Nastaví (alebo `null` = skryje) odkaz na samostatnú stránku v hlavičke drawera. */
  setFullPageUrl(url: string | any[] | null): void {
    this.fullPageUrl.set(url);
  }
}
