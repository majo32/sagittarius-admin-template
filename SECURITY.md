# Security Policy

## Supported versions

Only the latest published minor version of `sagittarius-admin-template` receives security fixes.

| Version | Supported |
|---|---|
| latest `0.x` | ✅ |
| older | ❌ |

## Reporting a vulnerability

**Please do not open a public issue.** Report the problem privately via
[GitHub Security Advisories](https://github.com/majo32/sagittarius-admin-template/security/advisories/new)
("Report a vulnerability" on the repository's *Security* tab).

Include:

- affected version(s),
- a description of the issue and its impact,
- steps or a minimal reproduction.

You can expect an initial response within 7 days. Once a fix is released, the advisory will be published
and you will be credited unless you prefer otherwise.

## Scope

This package is a client-side Angular UI library. Vulnerabilities in Angular, Angular Material or other
dependencies should be reported to their respective projects; Dependabot keeps dependencies of this
repository up to date.

The npm package is published only from GitHub Actions with npm Trusted Publishing and
[provenance](https://docs.npmjs.com/generating-provenance-statements) – you can verify a release with
`npm audit signatures`.
