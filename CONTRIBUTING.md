# Contributing

Thanks for your interest in improving **sagittarius-admin-template**! Bug reports, ideas and pull requests are welcome.

## Before you start

- For anything larger than a small fix, please open an issue first so we can agree on the API.
- The **layout structure and behavior are a contract** with the applications that use the library. Visual design
  (colors, shadows, radii, typography) may change; inputs, content slots, `sg-admin-theme-*` class names and
  `--sg-*` tokens must not be renamed or removed without a deprecation alias.
- [`AGENTS.md`](AGENTS.md) contains the full architecture description and coding rules (in Slovak – it is also
  the context file for AI coding assistants).

## Setup

```bash
npm ci
npm run watch      # rebuilds the library into dist/ on change
npm start          # demo app on http://localhost:4200 (in a second terminal)
```

The demo app imports the library from `dist/`, not from the sources – keep `npm run watch` running. If a change
is not visible, stop `ng serve`, delete `.angular/cache` and start it again.

## Checks

```bash
npm run build      # library + demo (strict template type-check)
npm run test:ci    # unit tests, needs Chrome – set CHROME_BIN if it is not found
```

Please also check visual changes in the demo app on **desktop (1440 px) and mobile (390 px)**, in **light and dark
theme**, with an open (and nested) drawer and with the collapsed sidebar on hover.

## Code conventions

- Standalone components, signal `input()` / `output()` / `computed()`, `inject()`, built-in control flow (`@if`, `@for`).
- Library selectors use the `lib-` prefix, CSS classes `sg-`, public types `Sg*`.
- No hard-coded colors in component styles – use `var(--sg-…)`; a new color is a new token with light and dark
  variants (`light-dark()`).
- New public API must be exported from `projects/sagittarius-admin-template/src/public-api.ts` and shown in the demo app.
- Built-in UI texts go to `SgAdminLabels` (English default + Slovak set).
- Formatting follows `.editorconfig` (2 spaces, single quotes in TS).

## Pull requests

- Keep PRs focused; describe *what* and *why*.
- Add a unit test for new behavior and an entry to `CHANGELOG.md` for user-facing changes.
- Do not bump the package version – the maintainer does that when releasing.

By contributing you agree that your contribution is licensed under the [MIT License](LICENSE).
