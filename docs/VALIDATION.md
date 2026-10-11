# Standalone extraction validation

Validated on 11 October 2026 with Node 24, Vite 8, Python 3.13 and the existing
Django backend. This report describes the new client connected to a local
isolated demo database. It is not a new hosted-deployment verification or a
new model evaluation.

## Installation and build

- Frozen `npm ci` succeeded. In Codex, the cache must be in a writable location:
  `npm ci --cache /workspace/.cache/npm`.
- API-error utility tests: **7 passed**.
- Predictive API/calculation tests: **33 passed**.
- ESLint on the newly added client shell, entry point and error boundary: passed.
- Production client build: passed.
- Copied application files were checked against the recorded source hashes.
  The dependency lockfile and API-documentation links are intentionally adapted.

## Real Chromium walkthrough

The client ran on local port 5174, proxying to the existing Django application
on local port 8001 with an isolated SQLite test database. The test used existing
staff-session endpoints and real API responses. It did not use frontend fixture
mode for any successful planning or model request.

- Anonymous predictive access returned **403**.
- The reused sign-in dialog authenticated a local staff test account through
  `/api/login/`; no new authentication service was added.
- My kitchen mode displayed one stored, accepted preorder and its ingredient
  risks. All five assistant steps worked.
- The hypothetical purchase endpoint recalculated the chicken shortfall to
  **0**, without writing a purchase or stock change.
- Confirmed-preorder and batch-evidence navigation worked.
- An intentionally intercepted **503** exercised the loading-error/retry UI;
  retry restored real database responses. No fallback prediction was fabricated.
- All five Genpact endpoints returned **200**, including the CSRF-protected
  promotion POST. Source labels distinguished model demand and simulated operations.
- Center **13**, week **146**, returned **51 meal forecasts** and **4 ingredient
  risk records**. Total baseline predicted demand was **21,916.11** orders;
  the assumed promotion scenario returned **49,246.95**. This is an
  observational-flag comparison, not proven causal uplift or guaranteed sales.
- The actual UI promotion selector loaded the returned comparison.
- Invalid week input returned **400**; a POST without CSRF returned **403**.
- Desktop and 390-pixel mobile layouts rendered without horizontal overflow.
- Kitchen-management links led to explicit handoff pages, with links to the
  existing kitchen application. Unknown paths displayed recovery navigation.
- Sign-out removed predictive access. Browser JavaScript errors: **0**.

## Existing model verification

The existing `demand_model.cbm` loaded as a **200-tree CatBoost model**. Direct
predictions from that artifact exactly matched the service's 51 baseline
forecasts. All three historical CSVs, all three simulated operational CSVs,
and the saved metrics were available in the original backend workspace.

Model SHA-256:

```text
b7608c307e17bb6d2b5b4ca15c4e495394cc405035de8c947522574da28b91a9
```

Saved chronological evaluation remains **28.23% model WAPE**, versus **34.81%
lag-1 baseline WAPE**, for weeks 136–145. The extraction neither retrained the
model nor claimed new accuracy. Week 146 has no observed labels in the dataset.
These metrics do not establish forecasting accuracy for the local kitchen.

## Remaining hosting requirements

This repository has been prepared for a separate client build, but it has not
been deployed. A new hosted domain must be explicitly trusted by the existing
Django backend for CSRF-protected authentication and POST requests. The included
Vercel reverse-proxy configuration has not been exercised on a new hosted domain.
The existing integrated website and production database were not modified.

The client depends on the existing API service. Model bundles, databases and
private browser artifacts are excluded from Git. Screenshots and detailed
runtime receipts from this cloud validation are local development artifacts,
not a claim of durable public storage.
