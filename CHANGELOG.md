# Changelog

All notable changes to `sagittarius-admin-template` are documented here.
The project follows [Semantic Versioning](https://semver.org/).

## 0.2.0

First public release on npmjs.com.

- `<lib-sagittarius-admin>` layout: collapsible sidebar (hover overlay), mobile overlay sidebar, sticky header with user menu, footer.
- Content projection slots: header left / middle / actions, sidebar bottom, footer.
- `DrawerService` / `DrawerRef`: stacked drawer layers with browser back-button support and optional "open as full page" link (`fullPageUrl`).
- Design tokens (`--sg-*`) with light/dark theme via `light-dark()`, primary color taken from the Angular Material theme.
- Page utility classes: `sg-page`, `sg-card`, `sg-grid`, `sg-stat`, `sg-badge`, `sg-toolbar`, `sg-form-grid`, `sg-kv`, `sg-empty-state`, …
- Built-in texts (aria labels, tooltips) configurable via `provideSgAdminLabels()` / `SG_ADMIN_LABELS`; English by default, Slovak set `SG_ADMIN_LABELS_SK` included.
- Removed the generated placeholder component `SagittariusAdminTemplate` (`lib-sagittarius-admin-template`).
- Demo app translated to English.
