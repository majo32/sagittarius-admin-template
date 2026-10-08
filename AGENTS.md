# Instructions for AI agents – Sagittarius Admin Template

This file is binding context for every AI agent (Claude Code, Copilot, Cursor…) that modifies this repository. Read it in full before making any change.

## 1. What is in the repository

An Angular 20 workspace (`angular.json`) with two projects:

| Project | Type | Purpose |
|---|---|---|
| `projects/sagittarius-admin-template` | library (ng-packagr) | Admin application layout: sidebar, header, content, drawer, footer + design tokens and helper CSS classes. Published to npmjs.com as `sagittarius-admin-template`. |
| `projects/sagittarius-admin-template-example` | application | Sample admin application that uses the library. Serves as living documentation and for manual testing. |

Dependencies: Angular 20, Angular Material 20 (M3), CDK, Router. Do not add any other UI libraries without agreement.

## 2. Commands

```bash
npm ci                                            # install
npx ng build sagittarius-admin-template           # build the library -> dist/sagittarius-admin-template
npm run watch                                     # build the library in watch mode (during development)
npx ng serve sagittarius-admin-template-example       # dev application at http://localhost:4200
npx ng build sagittarius-admin-template-example       # production build of the dev application (template type check)
npm run test:ci                                   # all tests, single run (requires CHROME_BIN)
```

Tests (Karma needs Chrome; if it is not installed, use e.g. Playwright chromium-headless-shell via `CHROME_BIN`):

```bash
CHROME_BIN=/path/to/chrome npx ng test sagittarius-admin-template --watch=false --browsers=ChromeHeadless
CHROME_BIN=/path/to/chrome npx ng test sagittarius-admin-template-example --watch=false --browsers=ChromeHeadless
```

### Important pitfalls

- **The dev application imports the library from `dist/`**, not from sources (`tsconfig.json` → `paths.sagittarius-admin-template = ./dist/sagittarius-admin-template`). After every change to library TS/HTML/SCSS, the library must be rebuilt (or have `npm run watch` running).
- **The dev server's Vite cache** holds the pre-bundled library. If a library change is not visible even after a rebuild, stop `ng serve`, delete `.angular/cache/*/sagittarius-admin-template-example/vite` and start again.
- The library's global stylesheet (`projects/sagittarius-admin-template/styles/sagittarius-admin.scss`) is loaded by the dev application **directly from sources** (see `angular.json` → `styles`), so changes to it take effect immediately.
- The library is imported as `'sagittarius-admin-template'` – in the dev app (via `paths` to `dist/`) as well as in third-party applications (from npm).
- Never commit `.npmrc` with a token (it is in `.gitignore`); publishing is done by GitHub Actions via npm Trusted Publishing. See `PUBLIKOVANIE.md`.

## 3. Library architecture

```
src/lib/sagittarius-admin/
  sagittarius-admin.ts|html|scss     <lib-sagittarius-admin> – the whole layout
  sagittarius-admin.models.ts        SgMenuItem, SgUser, SgUserMenuItem, DrawerOptions, DrawerData
  sagittarius-admin.labels.ts        SgAdminLabels, SG_ADMIN_LABELS (token), SG_ADMIN_LABELS_EN/_SK, provideSgAdminLabels()
  drawer-service.ts                  DrawerService – public API for opening drawers
  drawer-ref.ts                      DrawerRef – injectable into a component inside the drawer
  drawer-component/                  drawer host, holds the layer stack (internal)
    drawer-content/                  wrapper of a single layer: header (back/close, title) + body (internal)
src/public-api.ts                      the only entry point – anything not exported here is not public
styles/sagittarius-admin.scss          design tokens + helper classes (copied into the package as an asset)
```

### `<lib-sagittarius-admin>` – API

Inputs (signal `input()`): `appTitle`, `appShortTitle`, `logoUrl`, `homeRoute`, `menuItems: SgMenuItem[]`, `user: SgUser | null`, `userMenuItems: SgUserMenuItem[]`, `persistSidebarState` (localStorage key `sg-admin-sidebar-collapsed`).
Outputs: `userMenuItemClick`.

Content projection slots (attribute on the projected element):

| Slot | Where it is rendered |
|---|---|
| *(no attribute)* | main content – typically `<router-outlet />` |
| `sg-admin-header-left` | left part of the header (breadcrumbs, title) |
| `sg-admin-header-middle`, `sg-admin-header` | middle of the header |
| `sg-admin-header-actions` | right side of the header before the avatar (icon buttons) |
| `sg-admin-sidebar-bottom` | bottom of the sidebar below the menu |
| `sg-admin-footer` | footer (default content = `appTitle`) |

### Drawer

- `DrawerService.open(Component, data?, { title, fullPageUrl, fullPageIcon, fullPageLabel })` inserts the component as a new layer above the content. Layers can be nested (detail → edit); a nested layer has a back arrow, the first one a close (×) button.
- `data` are the component's input values – for signal `input()` `setInput` is called, others are assigned to the instance. The `DrawerData<T>` type unwraps signal inputs.
- A component in the drawer gets `inject(DrawerRef)` → `close()`, `setTitle()`, `title` signal, `setFullPageUrl()`, `fullPageUrl` signal.
- `fullPageUrl` (string = `navigateByUrl`, array = router commands): an icon is shown in the right corner of the layer header (`fullPageIcon`, default `open_in_full`; tooltip/aria `fullPageLabel`, default `SgAdminLabels.drawerFullPage`), which is a `routerLink` with `replaceUrl` – it closes all layers and replaces the drawer's history entry with the target page. A component usable outside the drawer as well injects `DrawerRef` with `{ optional: true }`.
- Each open adds a history entry (`Location.go` with the same URL). The browser / mobile Back button closes the top layer (`PlatformLocation.onPopState`). `DrawerRef.close()` calls `history.back()`.
- Imperative router navigation (click in the menu) closes all layers.
- Backward compatibility: if `data` is provided and the component has no `close` of its own, it receives a `close()` property.

### Texts (i18n)

- Aria labels and tooltips of the layout and drawer live in `SgAdminLabels`; the `SG_ADMIN_LABELS` token defaults to `SG_ADMIN_LABELS_EN`.
- An application sets them with `provideSgAdminLabels(SG_ADMIN_LABELS_SK)` or only some keys `provideSgAdminLabels({ drawerClose: '…' })` – missing ones are filled in from English.

## 4. Layout – DO NOT CHANGE without explicit instruction

The layout is a contract with the applications that use the library. The design (colors, shadows, radii, typography) may change, **the structure and behavior may not**:

```
.sg-admin-theme (flex row, 100vw × 100dvh)
├── aside.sg-admin-theme-sidebar          [.collapsed | .expanded | .open]
│   └── .sg-admin-theme-sidebar-wrapper   [.hover | .no-hover]
│       ├── .sg-admin-theme-sidebar-header  (logo + collapse button)
│       └── .sg-admin-theme-sidebar-body    (profile, nav, sidebar-bottom slot)
└── .sg-admin-theme-body (flex column)
    ├── header.sg-admin-theme-header        (left / middle / right box)
    ├── main.sg-admin-theme-main
    │   ├── .sg-admin-theme-drawer          [.closed]  – absolutely positioned over the whole main
    │   └── .sg-admin-theme-content         – ng-content, z-index: 0 (stacking context)
    └── footer.sg-admin-theme-footer
```

Behavior rules:
- Breakpoint **800 px** (`MOBILE_BREAKPOINT` in TS and `@media (max-width: 800px)` in SCSS – always change both).
- Desktop: sidebar 260 px; collapsed 64 px, on hover it expands **as an overlay** (does not shift the content). After clicking the toggle, hover is ignored for 300 ms.
- Mobile: the sidebar is a fixed full-width overlay (opened by the hamburger in the header, closed by the × button or a click on a menu item); the whole page scrolls, the header is sticky.
- On desktop the drawer covers the entire `main` area (header and sidebar remain visible); on mobile it is fixed over the whole screen.
- Do not rename `sg-admin-theme-*` class names – applications may have styles bound to them.

## 5. Design system

### Tokens
All colors and dimensions are `--sg-*` CSS variables defined in `:root` in `styles/sagittarius-admin.scss`. **Never hard-code a color in library component SCSS** – always use `var(--sg-…)`. New color = new token in `:root`.

- Light/dark theme via `light-dark(light, dark)`; switched by `color-scheme` on `<html>` (in the dev app the `.dark-theme` class). Every new color token must have both variants.
- The primary color is taken from the Angular Material theme: `--sg-primary: var(--mat-sys-primary)`. Do not hard-code the palette in the library – the application sets it via `mat.theme()`.
- The sidebar is dark in both themes (`--sg-sidebar-*`, without `light-dark`) and has `color-scheme: dark` so that Material elements and scrollbars inside it are dark.
- Token groups: dimensions (`--sg-header-height`, `--sg-sidebar-width`, `--sg-sidebar-collapsed-width`, `--sg-footer-height`, `--sg-drawer-header-height`, `--sg-page-padding`, `--sg-gap`), surfaces (`--sg-bg`, `--sg-surface`, `--sg-surface-2`, `--sg-border`, `--sg-hover`), text (`--sg-text`, `--sg-text-muted`), states (`--sg-success|warning|danger|info|neutral` + `-soft`), radii and shadows (`--sg-radius`, `--sg-radius-sm`, `--sg-shadow-*`).
- Styles for elements outside the component host (Material overlay – e.g. user menu `.sg-admin-user-menu`) belong in the global stylesheet, not in component SCSS (emulated encapsulation would not reach them).

### Helper classes for application pages
Applications should build pages from these classes (examples in the dev app, `src/app/pages/*`):

| Class | Usage |
|---|---|
| `.sg-page` (+`.sg-page-narrow`) | page root – padding, max width, vertical gap |
| `.sg-page-header` › `.sg-page-title`, `.sg-page-subtitle`, `.sg-page-actions` | page header |
| `.sg-breadcrumbs` | breadcrumb navigation (separators added by CSS) |
| `.sg-card` › `.sg-card-header`, `.sg-card-title`, `.sg-card-subtitle`, `.sg-card-body`, `.sg-card-body-flush`, `.sg-card-footer` | card; `-flush` for tables without padding |
| `.sg-grid` (+`.sg-grid-2/3/4`, `.sg-span-2`) | responsive grid, number = max. column count |
| `.sg-stat` › `.sg-stat-head`, `-label`, `-icon`, `-value`, `-delta` (`.up`/`.down`) | KPI tile (combine with `.sg-card`) |
| `.sg-badge` + `.sg-badge-success/warning/danger/info` (`.sg-badge-plain` without dot) | status |
| `.sg-avatar` (+`.sg-avatar-lg`) | circle with initials |
| `.sg-toolbar`, `.sg-toolbar-spacer` | filter row above a table (compact form fields) |
| `.sg-table-clickable` | hover + pointer on `mat-table` rows |
| `.sg-form-grid` (+`.sg-col-full`), `.sg-form-section-title` | forms |
| `.sg-kv` (`dl > dt/dd`) | key–value detail |
| `.sg-empty-state` | empty state / 404 (icon, `h3`, `p`, action) |
| `.sg-drawer-page` | root of a component's content inside the drawer |
| `.sg-muted`, `.sg-text-right`, `.sg-nowrap` | utilities |

New recurring UI pattern → add a class to the global stylesheet (prefix `sg-`), use it in the dev app and add it to this table.

### Visual rules
- Surfaces: background `--sg-bg`, cards `--sg-surface` with a 1px `--sg-border` and a subtle shadow; no heavy shadows or gradients on surfaces (gradient only in the sidebar avatar).
- Spacing in multiples of 4 px; standard 16 px (`--sg-gap`), page padding 24 px (mobile 16 px).
- Typography: Roboto (from the Material theme); page title 24/600, card title 15/600, captions 12–13 `--sg-text-muted`.
- Status colors only for states (success/warning/error/info), always with text – never color alone.
- Animations short (150–300 ms) and respecting `prefers-reduced-motion`.
- Verify every visual change in **light and dark** themes and on **desktop (1440 px) and mobile (390 px)**.

## 6. Code conventions

- Standalone components, `imports` in the decorator. No NgModules.
- New code: signal `input()` / `output()` / `computed()` / `signal()`, `inject()`, new control flow (`@if`, `@for` with `track`). Do not use `NgIf/NgFor/NgClass`.
- Templates are strictly typed (`strictTemplates`) – the dev build must pass without errors.
- Always access `localStorage` inside `try/catch`.
- No `console.log` in the library.
- Library selectors have the `lib-` prefix, CSS classes `sg-`, public types `Sg*` (exception: existing `DrawerService`, `DrawerRef`).
- Comments are in Slovak; identifiers in English. UI texts in the dev app are in **English** (public demo).
- Do not hard-code texts built into the library (aria-label, tooltips) – they belong in `SgAdminLabels` (`sagittarius-admin.labels.ts`): add a new key to the interface as well as to `SG_ADMIN_LABELS_EN` and `SG_ADMIN_LABELS_SK`, and use `inject(SG_ADMIN_LABELS)` in the component. Applications change them via `provideSgAdminLabels()`.
- Formatting: `.editorconfig` (2 spaces, single quotes in TS).

## 7. Public API and versioning

- Everything public must be exported in `src/public-api.ts`. Do not export internal components (`DrawerComponent`, `DrawerContent`).
- The library is used by other projects – **do not make breaking changes** (renaming inputs, slots, `sg-admin-theme-*` classes, tokens) without agreement. If one is unavoidable, keep the old name as a deprecated alias.
- New dependency on an Angular package → add it to `peerDependencies` in `projects/sagittarius-admin-template/package.json`.
- Before publishing, bump the version in `projects/sagittarius-admin-template/package.json` (semver: fix = patch, new feature = minor, breaking = major). Only a human publishes – by creating a GitHub Release `vX.Y.Z` (workflow `.github/workflows/publish.yml`); also update `CHANGELOG.md`.

## 8. Change procedure (checklist)

1. Change in the library (TS/HTML/SCSS, possibly a token/class in `styles/sagittarius-admin.scss`).
2. Export in `public-api.ts` if it is public API; types go to `sagittarius-admin.models.ts`.
3. Usage example in the dev app (existing page or a new one in `src/app/pages/<name>/` + route in `app.routes.ts` + item in `menuItems` in `app.ts`).
4. `npx ng build sagittarius-admin-template` and `npx ng build sagittarius-admin-template-example` without errors.
5. Library unit tests (spec next to the component; for components with `routerLink` add `provideRouter([])`).
6. Visual check in the browser: desktop + mobile, light + dark theme, open drawer (including nested), collapsed sidebar with hover.
7. Update this file if the API, slots, tokens or rules changed.

## 9. Sample application (dev)

```
src/app/
  app.ts|html            layout configuration: menu, user, user menu, header actions, footer
  app.routes.ts          lazy page routes
  core/demo-data.ts      mock data (users, orders, revenue)
  core/users.store.ts    in-memory store (signal) – replaced by an API service in a real app
  core/theme.service.ts  light/dark theme switching (.dark-theme class on <html>)
  pages/dashboard        KPI tiles, bar chart (pure CSS), activity, table
  pages/users            table with filter, sorting and pagination; a row opens the drawer
  pages/user-detail      drawer content – detail, the Edit button opens a nested drawer (DrawerRef is optional)
  pages/user-page        /users/:userId – detail as a standalone page (fullPageUrl target from the drawer)
  pages/user-form        drawer content – reactive form with validation, DrawerRef.close() (DrawerRef is optional)
  pages/user-form-page   /users/new, /users/:userId/edit – form as a standalone page (fullPageUrl target)
  pages/form-example     large form: sections, FormArray of items, datepicker, summary
  pages/settings         settings: toggles, theme selection
  pages/not-found        404 and empty state example
```

For a new example, copy the structure of existing pages (`.sg-page` → `.sg-page-header` → `.sg-card`…), not custom layouts.

## 10. Known limitations / ideas for further development

- The menu supports only one level (+ section headings); nested submenus are not supported.
- The drawer always has the full width of the `main` area; an optional width (e.g. `DrawerOptions.width`) would be an API extension – keep the default.
- `DrawerRef` does not return a result (`afterClosed`); if needed, add it in a backward-compatible way.
- Components do not use `ChangeDetectionStrategy.OnPush`; the layout state is in signals, so the transition is possible.
