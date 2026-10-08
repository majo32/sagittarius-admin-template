# Sagittarius Admin Template

[![CI](https://github.com/majo32/sagittarius-admin-template/actions/workflows/ci.yml/badge.svg)](https://github.com/majo32/sagittarius-admin-template/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/sagittarius-admin-template.svg)](https://www.npmjs.com/package/sagittarius-admin-template)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Admin application layout for **Angular 20 + Angular Material 3**. Drop one component into your app and get a collapsible sidebar, a header with a user menu, stacked drawers, a footer, light/dark theming and a set of CSS classes for building consistent pages.

**[▶ Live demo](https://majo32.github.io/sagittarius-admin-template/)** · **[npm package](https://www.npmjs.com/package/sagittarius-admin-template)** · **[Library docs](projects/sagittarius-admin-template/README.md)**

| Light | Dark |
|---|---|
| ![Dashboard – light theme](docs/screenshots/dashboard-light.png) | ![Dashboard – dark theme](docs/screenshots/dashboard-dark.png) |
| ![Drawer with user detail](docs/screenshots/drawer.png) | ![Mobile layout](docs/screenshots/mobile.png) |

## Features

- **Layout component** `<lib-sagittarius-admin>` – sidebar (260 px, collapses to 64 px and expands as an overlay on hover), sticky header, footer; full-screen overlay sidebar on mobile (< 800 px).
- **Stacked drawers** – `DrawerService.open(Component, inputs, options)` opens any component as a layer over the content. Layers nest (detail → edit), the browser Back button closes the top layer, and an optional link opens the same content as a full page.
- **Design tokens** – every color and size is a `--sg-*` CSS variable; light/dark via `light-dark()`; primary color follows your Angular Material theme.
- **Page utility classes** – `sg-page`, `sg-card`, `sg-grid`, `sg-stat`, `sg-badge`, `sg-toolbar`, `sg-form-grid`, `sg-kv`, `sg-empty-state`…
- **Modern Angular** – standalone components, signals, new control flow, strict templates. No dependencies besides Angular, CDK and Material.

## Quick start

```bash
npm i sagittarius-admin-template
```

```ts
import { SagittariusAdmin, SgMenuItem } from 'sagittarius-admin-template';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SagittariusAdmin],
  template: `
    <lib-sagittarius-admin appTitle="My admin" [menuItems]="menu">
      <router-outlet />
    </lib-sagittarius-admin>
  `,
})
export class App {
  menu: SgMenuItem[] = [
    { label: 'Dashboard', icon: 'space_dashboard', route: '/dashboard' },
    { label: 'Users', icon: 'group', route: '/users' },
  ];
}
```

Add the stylesheet `node_modules/sagittarius-admin-template/styles/sagittarius-admin.scss` to `angular.json` → `styles`, and a Material theme. Full setup, inputs, slots, drawer API and theming: **[library README](projects/sagittarius-admin-template/README.md)**.

## Repository structure

| Path | Description |
|---|---|
| [`projects/sagittarius-admin-template`](projects/sagittarius-admin-template) | The library (built with ng-packagr, published to npm). |
| [`projects/sagittarius-admin-template-example`](projects/sagittarius-admin-template-example) | Demo admin app – dashboard, table with drawer detail, forms, settings, empty states. Deployed to GitHub Pages. |

## Development

```bash
npm ci
npm run build:lib     # the demo imports the library from dist/, build it first
npm start             # demo on http://localhost:4200
npm run watch         # rebuild the library on change (run next to npm start)
npm run test:ci       # unit tests (headless Chrome)
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute and [SECURITY.md](SECURITY.md) for reporting vulnerabilities. Detailed guidelines for contributors and AI agents (layout contract, tokens, conventions) are in [AGENTS.md](AGENTS.md) (Slovak).

## Releasing

Releases are published to npm by GitHub Actions when a GitHub Release `vX.Y.Z` is created – see [PUBLIKOVANIE.md](PUBLIKOVANIE.md) and [CHANGELOG.md](CHANGELOG.md).

## License

[MIT](LICENSE) © Marian Spisiak
