# sagittarius-admin-template

Admin application layout for **Angular 20 + Angular Material 3**: collapsible sidebar (hover overlay on desktop, full-screen overlay on mobile), header with user menu, content area with **stacked drawers**, footer. Ships with design tokens (light/dark theme) and CSS utility classes for building pages.

- **Live demo:** https://GITHUB_USER.github.io/sagittarius-admin-template/
- **Source & demo app:** https://github.com/GITHUB_USER/sagittarius-admin-template

## Installation

```bash
npm i sagittarius-admin-template
```

Peer dependencies: `@angular/core`, `@angular/common`, `@angular/router`, `@angular/material`, `@angular/cdk` (20.x).

`angular.json` → `styles` (template stylesheet before your own styles):

```json
"styles": [
  "node_modules/sagittarius-admin-template/styles/sagittarius-admin.scss",
  "src/styles.scss"
]
```

`index.html` – fonts and icons:

```html
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

`styles.scss` – Material theme (the primary color is picked up by the template as well):

```scss
@use '@angular/material' as mat;

html {
  color-scheme: light;
  @include mat.theme((color: (primary: mat.$azure-palette), typography: Roboto, density: 0));

  &.dark-theme { color-scheme: dark; }
}
body { margin: 0; }
```

## Usage

```ts
import { SagittariusAdmin, SgMenuItem, SgUser, SgUserMenuItem } from 'sagittarius-admin-template';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SagittariusAdmin],
  template: `
    <lib-sagittarius-admin appTitle="My application" [menuItems]="menu" [user]="user" [userMenuItems]="userMenu">
      <div sg-admin-header-actions>…icon buttons…</div>
      <router-outlet />
      <span sg-admin-footer>© 2026 My Company</span>
    </lib-sagittarius-admin>
  `,
})
export class App {
  menu: SgMenuItem[] = [
    { label: 'Dashboard', icon: 'space_dashboard', route: '/dashboard' },
    { label: 'Management', spacer: true },
    { label: 'Users', icon: 'group', route: '/users', badge: 3 },
  ];
  user: SgUser = { name: 'Jane Doe', subtitle: 'Administrator' };
  userMenu: SgUserMenuItem[] = [
    { label: 'Profile', icon: 'person', route: '/profile' },
    { divider: true },
    { label: 'Sign out', icon: 'logout', action: () => this.logout() },
  ];
}
```

**Inputs:** `appTitle`, `appShortTitle`, `logoUrl`, `homeRoute`, `menuItems`, `user`, `userMenuItems`, `persistSidebarState` (stores the collapsed state in `localStorage`).
**Outputs:** `userMenuItemClick`.

**Content slots** (attribute on the projected element):

| Slot | Position |
|---|---|
| *(none)* | main content – typically `<router-outlet />` |
| `sg-admin-header-left` | left part of the header (breadcrumbs, title) |
| `sg-admin-header-middle` | middle of the header |
| `sg-admin-header-actions` | right side of the header, before the avatar |
| `sg-admin-sidebar-bottom` | bottom of the sidebar below the menu |
| `sg-admin-footer` | footer (defaults to `appTitle`) |

## Drawer

```ts
private drawer = inject(DrawerService);

openDetail(user: User) {
  this.drawer.open(UserDetail, { userId: user.id }, { title: user.name });
}
```

```ts
@Component({ /* … */ })
export class UserDetail {
  readonly userId = input.required<number>();
  private drawerRef = inject(DrawerRef);

  save() { /* … */ this.drawerRef.close(); }
}
```

- `data` (2nd argument) are the component inputs – signal `input()`s are set via `setInput`, other keys are assigned to the instance.
- Layers can be nested (detail → edit); a nested layer shows a back arrow, the first one a close button.
- The browser / mobile **Back button closes the top layer**; router navigation (e.g. a menu click) closes all layers.
- `DrawerRef` offers `close()`, `setTitle()`, `title`, `setFullPageUrl()`, `fullPageUrl`.

### Options (`DrawerOptions`)

| Option | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `''` | Title in the drawer header (runtime: `DrawerRef.setTitle()`). |
| `fullPageUrl` | `string \| any[]` | – | URL of a standalone page with the same content. When set, an icon link in the header closes all layers and navigates there (replacing the drawer history entry). |
| `fullPageIcon` | `string` | `open_in_full` | Material icon of that link. |
| `fullPageLabel` | `string` | `Otvoriť na celej stránke` | Tooltip and `aria-label`. |

```ts
this.drawer.open(UserDetail, { userId: user.id }, {
  title: user.name,
  fullPageUrl: ['/users', user.id],
});
```

A component that is used both inside and outside a drawer should inject the ref optionally: `inject(DrawerRef, { optional: true })`.

## Theming

All colors and sizes are CSS custom properties `--sg-*`. Override them in `:root`:

```css
:root {
  --sg-sidebar-bg: #1a1033;
  --sg-sidebar-accent: #b18cff;
  --sg-sidebar-width: 280px;
}
```

Dark theme: set `color-scheme: dark` on `<html>` (e.g. with a class, as above).

## Page utility classes

`sg-page`, `sg-page-header`, `sg-breadcrumbs`, `sg-card`, `sg-grid`, `sg-stat`, `sg-badge`, `sg-avatar`, `sg-toolbar`, `sg-table-clickable`, `sg-form-grid`, `sg-kv`, `sg-empty-state`, `sg-drawer-page`, `sg-muted`… See the demo app for examples of each.

## Notes

- Built-in UI strings (aria labels like "Zavrieť"/"Späť") are currently Slovak; i18n is planned.
- The sidebar menu supports one level plus section headers.

## License

MIT
