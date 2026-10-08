# Zverejnenie projektu – GitHub, demo, npm

Postup krok za krokom, ako tento repozitár zverejniť na GitHube, nasadiť demo pre vývojárov (GitHub Pages) a publikovať knižnicu do verejného npm registra (npmjs.com).

Čo je už pripravené:

| Súbor | Účel |
|---|---|
| `LICENSE` | MIT licencia (kopíruje sa aj do npm balíčka) |
| `README.md` | prezentačná stránka repozitára (screenshoty v `docs/screenshots/`) |
| `projects/sagittarius-admin-template/README.md` | dokumentácia, ktorá sa zobrazí na npmjs.com |
| `projects/sagittarius-admin-template/package.json` | npm meno `sagittarius-admin-template`, metadáta, `publishConfig.access = public` |
| `.github/workflows/ci.yml` | build + testy pri každom pushi a PR |
| `.github/workflows/demo.yml` | nasadenie dema na GitHub Pages pri pushi do `main` |
| `.github/workflows/publish.yml` | publikovanie do npm pri vytvorení GitHub Release |
| `CHANGELOG.md` | história verzií |

Oproti pôvodnému repozitáru: bez histórie gitu, bez `.npmrc` (token do Nexusu), bez skriptu `deploy-modernit`, bez odkazov na `@modernit` a Nexus; v deme sú neutrálne mená (`Ján Novák`, `@example.com`).

---

## 0. Predtým, než začneš

1. **Práva na kód.** Knižnica vznikla pôvodne pre ModernIT (`@modernit/...`, Nexus). Over si (zmluva / dohoda so zamestnávateľom), že ju smieš zverejniť pod MIT licenciou na svoje meno. Ak má byť autorom firma, uprav meno v `LICENSE`, `projects/sagittarius-admin-template/LICENSE` a pole `author` v `projects/sagittarius-admin-template/package.json`.
2. **Únik tokenu v starom repozitári.** V pôvodnom repozitári `sagittarius-admin-template-lib` je `.npmrc` s auth tokenom do Nexusu **commitnutý v gite**. Ten repozitár nikdy nezverejňuj a token v Nexuse radšej zneplatni/vygeneruj nový.
3. Potrebuješ účty: [github.com](https://github.com) a [npmjs.com](https://www.npmjs.com/signup) (zapni si 2FA – npm ho pri publikovaní vyžaduje).

## 1. Doplň svoje GitHub meno

V súboroch je placeholder `GITHUB_USER` (URL repozitára, dema, badge). Nahraď ho svojím GitHub používateľským menom (alebo organizáciou), napr. `marianspisiak`:

```bash
cd ../sagittarius-admin-template
grep -rl GITHUB_USER --exclude-dir=node_modules --exclude-dir=dist . | xargs sed -i '' 's/GITHUB_USER/tvoje-github-meno/g'
grep -rn GITHUB_USER --exclude-dir=node_modules --exclude-dir=dist .   # nesmie nič vypísať
```

> Dôležité: `repository.url` v `projects/sagittarius-admin-template/package.json` musí presne zodpovedať GitHub repozitáru, inak npm odmietne publikovanie s provenance / trusted publishing.

Ak chceš repozitár pomenovať inak ako `sagittarius-admin-template`, zmeň názov aj v týchto URL. Demo workflow si base href berie z názvu repozitára automaticky.

## 2. Over lokálne

```bash
npm ci
npm run build          # knižnica + demo
npm start              # http://localhost:4200
```

Testy (potrebujú Chrome; ak nemáš, `npx playwright install chromium-headless-shell` a cestu daj do `CHROME_BIN`):

```bash
CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run test:ci
```

## 3. Vytvor repozitár na GitHube

1. Na github.com → **New repository** → názov `sagittarius-admin-template`, **Public**, **bez** README/licencie/.gitignore (všetko už máme).
2. V termináli (repozitár je už inicializovaný s prvým commitom na vetve `main`):

```bash
git remote add origin git@github.com:tvoje-github-meno/sagittarius-admin-template.git
git add -A && git commit -m "Set GitHub owner"   # ak si robil krok 1
git push -u origin main
```

3. V **Settings → General** odporúčam:
   - *About* (ozubené koliesko na hlavnej stránke repa): popis, Website = URL dema, Topics: `angular`, `angular-material`, `admin-template`, `dashboard`, `layout`.
   - **Settings → Branches**: ochrana vetvy `main` (vyžadovať PR a prejdený CI) – voliteľné.

Po pushi sa spustí workflow **CI** (záložka *Actions*) – mal by byť zelený.

## 4. Demo na GitHub Pages

1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. Spusti workflow **Deploy demo** (Actions → Deploy demo → *Run workflow*), prípadne sa spustí sám pri ďalšom pushi do `main`.
3. Demo bude na `https://tvoje-github-meno.github.io/sagittarius-admin-template/`.

Poznámky:
- Workflow kopíruje `index.html` na `404.html`, takže fungujú aj priame odkazy a refresh na podstránkach (`/users/42`).
- Pri vlastnej doméne (Settings → Pages → Custom domain) zmeň v `.github/workflows/demo.yml` `--base-href` na `/`.

## 5. Prvé publikovanie do npm (ručne, raz)

Trusted publishing sa na npmjs.com dá nastaviť až pre existujúci balíček, preto prvú verziu publikuj ručne:

```bash
npm login                                  # prihlásenie na npmjs.com (otvorí prehliadač)
npm whoami                                 # kontrola
npm run build:lib
cd dist/sagittarius-admin-template
npm pack --dry-run                         # skontroluj obsah: LICENSE, README.md, fesm2022, index.d.ts, package.json, styles/
npm publish --access public
cd ../..
```

> Meno `sagittarius-admin-template` bolo k 8. 10. 2026 na npm voľné. Ak by medzičasom bolo obsadené, použi scope na svoje meno (napr. `@tvoje-npm-meno/sagittarius-admin-template`), zmeň `name` v `projects/sagittarius-admin-template/package.json`, cestu k stylesheetu v README a `paths` v `tsconfig.json` + importy v dev app.

Over na `https://www.npmjs.com/package/sagittarius-admin-template`. Ak máš vo `~/.npmrc` nastavený iný registry (Nexus), publikuj s `--registry=https://registry.npmjs.org/`.

## 6. Automatické publikovanie z GitHubu (Trusted Publishing)

1. Na npmjs.com → balíček → **Settings → Trusted Publisher → GitHub Actions**:
   - Organization or user: `tvoje-github-meno`
   - Repository: `sagittarius-admin-template`
   - Workflow filename: `publish.yml`
   - Environment: nechaj prázdne
2. Odporúčané: v tej istej sekcii **Publishing access → „Require two-factor authentication and disallow tokens“** – potom sa dá publikovať len cez GitHub Actions (alebo ručne s 2FA).

Žiadny token do GitHubu netreba. *(Alternatíva: vygeneruj na npmjs.com Granular Access Token s právom publish pre tento balíček a ulož ho v GitHube ako secret `NPM_TOKEN` – workflow ho použije automaticky.)*

## 7. Vydanie novej verzie

1. Zvýš verziu v `projects/sagittarius-admin-template/package.json` (semver: oprava = patch, nová funkcia = minor, breaking change = major).
2. Doplň `CHANGELOG.md`.
3. Commit + push do `main` (cez PR, CI musí prejsť).
4. GitHub → **Releases → Draft a new release** → nový tag `vX.Y.Z` (musí sa zhodovať s verziou v package.json, inak workflow skončí chybou) → popis zmien → **Publish release**.
5. Workflow **Publish to npm** zbuildí knižnicu, spustí testy a publikuje balíček s provenance. Verzia s pomlčkou (`1.0.0-beta.1`) sa publikuje s tagom `next`, ostatné ako `latest`.

## 8. Voliteľné vylepšenia

- **Angličtina**: README sú anglicky, ale demo app a texty v knižnici (aria-label „Zavrieť“, „Späť“, „Otvoriť na celej stránke“) sú po slovensky. Pre širšie publikum zváž preklad dema a i18n vstupov knižnice (viď `AGENTS.md`, kap. 6 a 10).
- **Legacy komponent** `SagittariusAdminTemplate` (`lib-sagittarius-admin-template`) je pozostatok z generovania – pred verziou 1.0.0 ho môžeš odstrániť bez obáv (npm balíček je nový).
- `SECURITY.md`, `CONTRIBUTING.md`, šablóny issues (`.github/ISSUE_TEMPLATE`), Dependabot (`.github/dependabot.yml`).
- Prepojenie s pôvodnými projektmi: interné aplikácie môžu prejsť z `@modernit/sagittarius-admin-template` na `sagittarius-admin-template` z npm (zmena importu a cesty k stylesheetu).
