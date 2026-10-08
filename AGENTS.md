# Pokyny pre AI agentov – Sagittarius Admin Template

Tento súbor je záväzný kontext pre každého AI agenta (Claude Code, Copilot, Cursor…), ktorý upravuje tento repozitár. Pred zmenou si ho prečítaj celý.

## 1. Čo je v repozitári

Angular 20 workspace (`angular.json`) s dvoma projektmi:

| Projekt | Typ | Účel |
|---|---|---|
| `projects/sagittarius-admin-template` | knižnica (ng-packagr) | Layout administračnej aplikácie: sidebar, header, obsah, drawer, footer + design tokeny a pomocné CSS triedy. Publikuje sa do npmjs.com ako `sagittarius-admin-template`. |
| `projects/sagittarius-admin-template-dev` | aplikácia | Vzorová admin aplikácia, ktorá knižnicu používa. Slúži ako živá dokumentácia a na manuálne testovanie. |

Závislosti: Angular 20, Angular Material 20 (M3), CDK, Router. Žiadne ďalšie UI knižnice nepridávaj bez dohody.

## 2. Príkazy

```bash
npm ci                                            # inštalácia
npx ng build sagittarius-admin-template           # build knižnice -> dist/sagittarius-admin-template
npm run watch                                     # build knižnice v watch režime (pri vývoji)
npx ng serve sagittarius-admin-template-dev       # dev aplikácia na http://localhost:4200
npx ng build sagittarius-admin-template-dev       # produkčný build dev aplikácie (kontrola typov šablón)
npm run test:ci                                   # všetky testy jednorazovo (potrebuje CHROME_BIN)
```

Testy (Karma potrebuje Chrome; ak nie je nainštalovaný, použi napr. Playwright chromium-headless-shell cez `CHROME_BIN`):

```bash
CHROME_BIN=/cesta/k/chrome npx ng test sagittarius-admin-template --watch=false --browsers=ChromeHeadless
CHROME_BIN=/cesta/k/chrome npx ng test sagittarius-admin-template-dev --watch=false --browsers=ChromeHeadless
```

### Dôležité pasce

- **Dev aplikácia importuje knižnicu z `dist/`**, nie zo zdrojákov (`tsconfig.json` → `paths.sagittarius-admin-template = ./dist/sagittarius-admin-template`). Po každej zmene TS/HTML/SCSS knižnice ju treba prebuildovať (alebo mať spustený `npm run watch`).
- **Vite cache dev servera** si drží predbalenú knižnicu. Ak zmena knižnice nie je vidieť ani po rebuilde, zastav `ng serve`, zmaž `.angular/cache/*/sagittarius-admin-template-dev/vite` a spusti znova.
- Globálny stylesheet knižnice (`projects/sagittarius-admin-template/styles/sagittarius-admin.scss`) dev aplikácia načítava **priamo zo zdrojákov** (viď `angular.json` → `styles`), takže jeho zmeny sa prejavia hneď.
- Knižnica sa importuje ako `'sagittarius-admin-template'` – v dev app (cez `paths` na `dist/`) aj v cudzích aplikáciách (z npm).
- `.npmrc` s tokenom nikdy necommituj (je v `.gitignore`); publikovanie robí GitHub Actions cez npm Trusted Publishing. Viď `PUBLIKOVANIE.md`.

## 3. Architektúra knižnice

```
src/lib/sagittarius-admin/
  sagittarius-admin.ts|html|scss     <lib-sagittarius-admin> – celý layout
  sagittarius-admin.models.ts        SgMenuItem, SgUser, SgUserMenuItem, DrawerOptions, DrawerData
  drawer-service.ts                  DrawerService – verejné API na otváranie drawerov
  drawer-ref.ts                      DrawerRef – injektovateľný do komponentu v draweri
  drawer-component/                  host drawera, drží zásobník vrstiev (interné)
    drawer-content/                  obal jednej vrstvy: hlavička (späť/zavrieť, titulok) + telo (interné)
src/lib/sagittarius-admin-template.ts  pôvodný demo komponent (legacy, nepoužíva sa)
src/public-api.ts                      jediný vstupný bod – čo tu nie je exportované, nie je verejné
styles/sagittarius-admin.scss          design tokeny + pomocné triedy (kopíruje sa do balíčka ako asset)
```

### `<lib-sagittarius-admin>` – API

Vstupy (signal `input()`): `appTitle`, `appShortTitle`, `logoUrl`, `homeRoute`, `menuItems: SgMenuItem[]`, `user: SgUser | null`, `userMenuItems: SgUserMenuItem[]`, `persistSidebarState` (localStorage kľúč `sg-admin-sidebar-collapsed`).
Výstupy: `userMenuItemClick`.

Content projection sloty (atribút na projektovanom elemente):

| Slot | Kde sa zobrazí |
|---|---|
| *(bez atribútu)* | hlavný obsah – typicky `<router-outlet />` |
| `sg-admin-header-left` | ľavá časť hlavičky (breadcrumbs, názov) |
| `sg-admin-header-middle`, `sg-admin-header` | stred hlavičky |
| `sg-admin-header-actions` | vpravo v hlavičke pred avatarom (ikonové tlačidlá) |
| `sg-admin-sidebar-bottom` | spodok sidebaru pod menu |
| `sg-admin-footer` | footer (má predvolený obsah = `appTitle`) |

### Drawer

- `DrawerService.open(Component, data?, { title, fullPageUrl, fullPageIcon, fullPageLabel })` vloží komponent ako novú vrstvu nad obsah. Vrstvy sa dajú vnárať (detail → úprava); vnorená vrstva má šípku späť, prvá krížik.
- `data` sú hodnoty vstupov komponentu – pre signal `input()` sa volá `setInput`, ostatné sa priradia na inštanciu. Typ `DrawerData<T>` rozbaľuje signal inputy.
- Komponent v draweri získa `inject(DrawerRef)` → `close()`, `setTitle()`, `title` signal, `setFullPageUrl()`, `fullPageUrl` signal.
- `fullPageUrl` (string = `navigateByUrl`, pole = príkazy routera): v pravom rohu hlavičky vrstvy sa zobrazí ikona (`fullPageIcon`, default `open_in_full`; tooltip/aria `fullPageLabel`), ktorá je `routerLink` s `replaceUrl` – zavrie všetky vrstvy a nahradí záznam histórie drawera cieľovou stránkou. Komponent použiteľný aj mimo drawera injektuje `DrawerRef` s `{ optional: true }`.
- Každé otvorenie pridá záznam do histórie (`Location.go` s rovnakou URL). Tlačidlo Späť v prehliadači / na mobile zavrie vrchnú vrstvu (`PlatformLocation.onPopState`). `DrawerRef.close()` robí `history.back()`.
- Imperatívna navigácia routera (klik v menu) zavrie všetky vrstvy.
- Spätná kompatibilita: ak sú zadané `data` a komponent nemá vlastnú `close`, dostane `close()` property.

## 4. Layout – NEMENIŤ bez výslovného pokynu

Layout je kontrakt s aplikáciami, ktoré knižnicu používajú. Dizajn (farby, tiene, zaoblenia, typografia) sa meniť môže, **štruktúra a správanie nie**:

```
.sg-admin-theme (flex row, 100vw × 100dvh)
├── aside.sg-admin-theme-sidebar          [.collapsed | .expanded | .open]
│   └── .sg-admin-theme-sidebar-wrapper   [.hover | .no-hover]
│       ├── .sg-admin-theme-sidebar-header  (logo + tlačidlo zbalenia)
│       └── .sg-admin-theme-sidebar-body    (profil, nav, sidebar-bottom slot)
└── .sg-admin-theme-body (flex column)
    ├── header.sg-admin-theme-header        (left / middle / right box)
    ├── main.sg-admin-theme-main
    │   ├── .sg-admin-theme-drawer          [.closed]  – absolútne cez celý main
    │   └── .sg-admin-theme-content         – ng-content, z-index: 0 (stacking context)
    └── footer.sg-admin-theme-footer
```

Pravidlá správania:
- Breakpoint **800 px** (`MOBILE_BREAKPOINT` v TS a `@media (max-width: 800px)` v SCSS – meniť vždy oboje).
- Desktop: sidebar 260 px; zbalený 64 px, pri hoveri sa rozbalí **ako overlay** (nepresúva obsah). Po kliknutí na prepínač sa hover 300 ms ignoruje.
- Mobil: sidebar je fixed overlay cez celú šírku (otvára ho hamburger v hlavičke, zatvára krížik alebo klik na položku menu); stránka scrolluje celá, header je sticky.
- Drawer na desktope prekrýva celú plochu `main` (header a sidebar ostávajú viditeľné); na mobile je fixed cez celú obrazovku.
- Názvy tried `sg-admin-theme-*` nepremenovávaj – aplikácie na ne môžu mať naviazané štýly.

## 5. Dizajn systém

### Tokeny
Všetky farby a rozmery sú CSS premenné `--sg-*` definované v `:root` v `styles/sagittarius-admin.scss`. **V SCSS komponentov knižnice nikdy nepíš natvrdo farbu** – vždy `var(--sg-…)`. Nová farba = nový token v `:root`.

- Svetlá/tmavá téma cez `light-dark(svetlá, tmavá)`; prepína sa `color-scheme` na `<html>` (v dev app trieda `.dark-theme`). Každý nový farebný token musí mať obe varianty.
- Primárna farba sa preberá z Angular Material témy: `--sg-primary: var(--mat-sys-primary)`. Nemeň paletu natvrdo v knižnici – aplikácia si ju nastaví cez `mat.theme()`.
- Sidebar je tmavý v oboch témach (`--sg-sidebar-*`, bez `light-dark`) a má `color-scheme: dark`, aby Material prvky a scrollbary v ňom boli tmavé.
- Skupiny tokenov: rozmery (`--sg-header-height`, `--sg-sidebar-width`, `--sg-sidebar-collapsed-width`, `--sg-footer-height`, `--sg-drawer-header-height`, `--sg-page-padding`, `--sg-gap`), plochy (`--sg-bg`, `--sg-surface`, `--sg-surface-2`, `--sg-border`, `--sg-hover`), text (`--sg-text`, `--sg-text-muted`), stavy (`--sg-success|warning|danger|info|neutral` + `-soft`), zaoblenia a tiene (`--sg-radius`, `--sg-radius-sm`, `--sg-shadow-*`).
- Štýly pre prvky mimo hostiteľa komponentu (Material overlay – napr. user menu `.sg-admin-user-menu`) patria do globálneho stylesheetu, nie do SCSS komponentu (emulated encapsulation by ich nezasiahla).

### Pomocné triedy pre stránky aplikácií
Aplikácie majú stavať stránky z týchto tried (ukážky v dev app, `src/app/pages/*`):

| Trieda | Použitie |
|---|---|
| `.sg-page` (+`.sg-page-narrow`) | koreň stránky – padding, max-šírka, vertikálny gap |
| `.sg-page-header` › `.sg-page-title`, `.sg-page-subtitle`, `.sg-page-actions` | hlavička stránky |
| `.sg-breadcrumbs` | omrvinková navigácia (oddeľovače dopĺňa CSS) |
| `.sg-card` › `.sg-card-header`, `.sg-card-title`, `.sg-card-subtitle`, `.sg-card-body`, `.sg-card-body-flush`, `.sg-card-footer` | karta; `-flush` pre tabuľky bez paddingu |
| `.sg-grid` (+`.sg-grid-2/3/4`, `.sg-span-2`) | responzívna mriežka, číslo = max. počet stĺpcov |
| `.sg-stat` › `.sg-stat-head`, `-label`, `-icon`, `-value`, `-delta` (`.up`/`.down`) | KPI dlaždica (kombinuj s `.sg-card`) |
| `.sg-badge` + `.sg-badge-success/warning/danger/info` (`.sg-badge-plain` bez bodky) | stav |
| `.sg-avatar` (+`.sg-avatar-lg`) | kruh s iniciálami |
| `.sg-toolbar`, `.sg-toolbar-spacer` | riadok filtrov nad tabuľkou (kompaktné form fieldy) |
| `.sg-table-clickable` | hover + pointer na riadkoch `mat-table` |
| `.sg-form-grid` (+`.sg-col-full`), `.sg-form-section-title` | formuláre |
| `.sg-kv` (`dl > dt/dd`) | detail kľúč–hodnota |
| `.sg-empty-state` | prázdny stav / 404 (ikona, `h3`, `p`, akcia) |
| `.sg-drawer-page` | koreň obsahu komponentu v draweri |
| `.sg-muted`, `.sg-text-right`, `.sg-nowrap` | utility |

Nová opakujúca sa UI vzorka → pridaj triedu do globálneho stylesheetu (prefix `sg-`), použi ju v dev app a doplň do tejto tabuľky.

### Vizuálne pravidlá
- Plochy: pozadie `--sg-bg`, karty `--sg-surface` s 1px `--sg-border` a jemným tieňom; žiadne hrubé tiene ani gradienty na plochách (gradient len v avatare sidebaru).
- Rozostupy v násobkoch 4 px; štandard 16 px (`--sg-gap`), padding stránky 24 px (mobil 16 px).
- Typografia: Roboto (z Material témy); nadpis stránky 24/600, nadpis karty 15/600, popisky 12–13 `--sg-text-muted`.
- Stavové farby len pre stavy (úspech/varovanie/chyba/info), vždy s textom – nie iba farbou.
- Animácie krátke (150–300 ms) a rešpektujú `prefers-reduced-motion`.
- Každú vizuálnu zmenu over v **svetlej aj tmavej** téme a na **desktope (1440 px) aj mobile (390 px)**.

## 6. Konvencie kódu

- Standalone komponenty, `imports` v dekorátore. Žiadne NgModules.
- Nový kód: signal `input()` / `output()` / `computed()` / `signal()`, `inject()`, nový control flow (`@if`, `@for` s `track`). Nepoužívaj `NgIf/NgFor/NgClass`.
- Šablóny sú typovo striktné (`strictTemplates`) – dev build musí prejsť bez chýb.
- Prístup k `localStorage` vždy v `try/catch`.
- Žiadne `console.log` v knižnici.
- Selektory knižnice majú prefix `lib-`, CSS triedy `sg-`, verejné typy `Sg*` (výnimka: existujúce `DrawerService`, `DrawerRef`).
- Komentáre a texty UI sú po slovensky; identifikátory po anglicky. Texty zabudované v knižnici (aria-label „Zavrieť“, „Späť“…) sú zatiaľ natvrdo – pri zavádzaní i18n ich presuň do vstupov alebo `InjectionToken`.
- Formátovanie: `.editorconfig` (2 medzery, jednoduché úvodzovky v TS).

## 7. Verejné API a verziovanie

- Všetko verejné musí byť exportované v `src/public-api.ts`. Interné komponenty (`DrawerComponent`, `DrawerContent`) neexportuj.
- Knižnicu používajú iné projekty – **nerob breaking changes** (premenovanie vstupov, slotov, tried `sg-admin-theme-*`, tokenov) bez dohody. Ak je nevyhnutná, ponechaj starý názov ako deprecated alias.
- Nová závislosť na Angular balíčku → pridaj do `peerDependencies` v `projects/sagittarius-admin-template/package.json`.
- Pred publikovaním zvýš verziu v `projects/sagittarius-admin-template/package.json` (semver: oprava = patch, nová funkcia = minor, breaking = major). Publikuje len človek – vytvorením GitHub Release `vX.Y.Z` (workflow `.github/workflows/publish.yml`); doplň aj `CHANGELOG.md`.

## 8. Postup pri zmene (checklist)

1. Zmena v knižnici (TS/HTML/SCSS, prípadne token/trieda v `styles/sagittarius-admin.scss`).
2. Export v `public-api.ts`, ak ide o verejné API; typy do `sagittarius-admin.models.ts`.
3. Ukážka použitia v dev app (existujúca stránka alebo nová v `src/app/pages/<nazov>/` + routa v `app.routes.ts` + položka v `menuItems` v `app.ts`).
4. `npx ng build sagittarius-admin-template` a `npx ng build sagittarius-admin-template-dev` bez chýb.
5. Unit testy knižnice (spec vedľa komponentu; pri komponentoch s `routerLink` pridaj `provideRouter([])`).
6. Vizuálna kontrola v prehliadači: desktop + mobil, svetlá + tmavá téma, otvorený drawer (aj vnorený), zbalený sidebar s hoverom.
7. Aktualizuj tento súbor, ak sa zmenilo API, sloty, tokeny alebo pravidlá.

## 9. Vzorová aplikácia (dev)

```
src/app/
  app.ts|html            konfigurácia layoutu: menu, používateľ, user menu, akcie v hlavičke, footer
  app.routes.ts          lazy routy stránok
  core/demo-data.ts      mock dáta (používatelia, objednávky, tržby)
  core/users.store.ts    in-memory store (signal) – v reálnej app nahradí API služba
  core/theme.service.ts  prepínanie svetlá/tmavá téma (trieda .dark-theme na <html>)
  pages/dashboard        KPI dlaždice, stĺpcový graf (čisté CSS), aktivita, tabuľka
  pages/users            tabuľka s filtrom, triedením a stránkovaním; riadok otvára drawer
  pages/user-detail      obsah drawera – detail, tlačidlo Upraviť otvorí vnorený drawer (DrawerRef je optional)
  pages/user-page        /users/:userId – detail ako samostatná stránka (cieľ fullPageUrl z drawera)
  pages/user-form        obsah drawera – reaktívny formulár s validáciou, DrawerRef.close() (DrawerRef je optional)
  pages/user-form-page   /users/new, /users/:userId/edit – formulár ako samostatná stránka (cieľ fullPageUrl)
  pages/form-example     veľký formulár: sekcie, FormArray položiek, datepicker, súhrn
  pages/settings         nastavenia: prepínače, výber témy
  pages/not-found        404 a ukážka prázdneho stavu
```

Pri novej ukážke kopíruj štruktúru existujúcich stránok (`.sg-page` → `.sg-page-header` → `.sg-card`…), nie vlastné layouty.

## 10. Známe obmedzenia / nápady na ďalší vývoj

- Menu podporuje len jednu úroveň (+ sekčné nadpisy); vnorené podmenu nie je.
- Texty v knižnici nie sú lokalizovateľné (viď kap. 6).
- Drawer má vždy plnú šírku plochy `main`; voliteľná šírka (napr. `DrawerOptions.width`) by bola rozšírenie API – zachovaj default.
- `DrawerRef` nevracia výsledok (`afterClosed`); ak bude treba, pridaj ho spätne kompatibilne.
- `SagittariusAdminTemplate` (`lib-sagittarius-admin-template`) je pozostatok z generovania; je exportovaný, takže jeho odstránenie je breaking change.
- Komponenty nepoužívajú `ChangeDetectionStrategy.OnPush`; stav layoutu je v signáloch, takže prechod je možný.
