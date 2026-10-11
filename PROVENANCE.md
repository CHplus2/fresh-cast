# Source and reuse disclosure

This repository is a focused **frontend extraction** from
[CHplus2/preorder-freshness](https://github.com/CHplus2/preorder-freshness), source
commit [`4be1e8468b870f880f8478fd26e5d1edfe5c1261`](https://github.com/CHplus2/preorder-freshness/commit/4be1e8468b870f880f8478fd26e5d1edfe5c1261),
on `integration/dormathon-demo`.

That repository retains the source history, including the pre-existing
ecommerce application and subsequent FreshCast development. The extraction
does not remove or rewrite that history. FreshCast was developed on top of an
existing Django/React application; this repository must not be represented as
evidence that all its code was written during a new 24-hour event. New Git
commits record the extraction and its later maintenance, not the original
creation dates of copied files. Eligibility under a from-scratch rule remains
an organizer decision.

## Reused without changing application behavior

- `src/features/predictive/`: the existing developer-authored FreshCast decision
  assistant, explorers, stations, local planning flow, API clients, validators,
  fixtures, calculations, styles and tests.
- `src/contexts/`: existing session authentication and UI contexts.
- `src/components/LoginModal/`, `ModalDialog`, `PageLoading`, `src/hoc/RequireAuth.jsx`
  and `src/utils/`: existing login, accessibility, authorization and API utilities.
- `docs/predictive-api-contract.md`: existing implemented backend schema;
  documentation hyperlinks now point to the source repository.
- Package versions and ESLint configuration originate from the existing frontend.
  The package manifest and lockfile were narrowed to this client.

The source file paths and SHA-256 hashes at extraction are recorded in
[source-manifest.json](docs/source-manifest.json). These are **source hashes**;
the adapted lockfile and API-documentation links intentionally differ.

## Work added for this extraction

Standalone React entry point and navigation, handoff links to kitchen pages,
error boundary, Vite API proxy configuration, static-host routing configuration,
client CI, setup instructions, and provenance/validation documentation.

## Existing API service

Orders, recipes, inventory, staff permissions, CatBoost inference and data storage
are supplied by the existing backend. Its implementation and training history
remain in the source repository. No model, historical dataset, credentials,
database or generated evaluation artifact is copied into this Git repository.

No authorship is reassigned by copying these files. The original authorship and
history remain available through the linked source commit.
