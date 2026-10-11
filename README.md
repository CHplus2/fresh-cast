# FreshCast — Kitchen Decision Assistant

A focused React client for detecting ingredient waste and shortages, explaining
the evidence, and comparing possible kitchen actions. The repository is named
`fresh-cart`; the existing product and interface are **FreshCast**.

**This is an extraction of existing work, not a claim that the application was
created from scratch during a new 24-hour sprint.** See [PROVENANCE.md](PROVENANCE.md)
for the original repository and exact source commit. The original Git history
has been preserved. Hackathon reuse eligibility must be confirmed with the organizers.

## What runs here

- The existing interactive decision assistant, demand view and inventory evidence.
- Existing Django staff sign-in, session cookies and CSRF protection.
- A small standalone navigation shell; ecommerce administration stays in the
  connected kitchen application.

The Django backend and CatBoost artifact stay in
[preorder-freshness](https://github.com/CHplus2/preorder-freshness/tree/integration/dormathon-demo).
This client reads its existing REST APIs; it does not contain a second database,
new training pipeline, or copied payment/storefront features. Cloning this client
alone does not supply an API server or trained-model bundle.

## Data sources

| Mode | What it actually does |
| --- | --- |
| My kitchen (default) | Calculates requirements and FEFO risks from stored confirmed preorders, accepted recipes and kitchen batches. Current records are fictional demo transactions. No demand model is used. |
| Genpact · Live API | Runs the existing trained CatBoost model on external weekly meal/center demand. Inventory, recipes and supplier inputs in this mode are simulated and are not mapped to the kitchen menu. |
| Frontend fixtures | Explicit synthetic responses for interface exploration. No model or database calculation runs. |

The existing CatBoost evaluation achieved **28.23% WAPE**, versus **34.81%** for
the lag-1 baseline, on chronologically held-out weeks 136–145. WAPE measures
total absolute prediction error divided by total observed demand; lower is
better. These results do not validate forecasting for this shop. Week 146 is
an unlabelled forecast. No model was retrained during this extraction.

The five-step flow is: **detect → categorize → prioritize → explain → decide**.
Scenario comparisons are advisory; they do not place purchases, change orders,
deduct inventory, or establish causal promotion effects.

## Run the client

Use Node.js 24. From this repository:

```powershell
npm ci
Copy-Item config.example .env.local
npm run dev
```

On your computer, open `http://127.0.0.1:5174/admin/ai/decisions`.
Use an existing **staff** account from the connected Django application.

The local server proxies `/api/` to `http://127.0.0.1:8001` by default.
Change `FRESHCAST_API_TARGET` in your ignored `.env.local` if needed.
`VITE_KITCHEN_ORIGIN` controls links to orders, planner, inventory and account
recovery; it is public configuration, not a credential. Restart Vite after changes.

## Start the existing API safely on Windows

Use a separate PowerShell terminal in the existing `preorder-freshness` checkout.
Preserve its uncommitted changes; do not reset it. These commands use an isolated
local SQLite database, not Supabase or production:

```powershell
git switch integration/dormathon-demo
py -3.13 -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt -r backend/predictive_ai/requirements-ml.lock
Remove-Item Env:VERCEL -ErrorAction SilentlyContinue
$demoDb = (Join-Path (Get-Location) 'freshcast-local-demo.sqlite3').Replace('\', '/')
$env:DATABASE_URL = "sqlite:///$demoDb"
$env:SECRET_KEY = & .\.venv\Scripts\python -c "import secrets; print(secrets.token_urlsafe(48))"
$env:DEBUG = 'True'
$env:ALLOWED_HOSTS = 'localhost,127.0.0.1'
$env:CSRF_TRUSTED_ORIGINS = 'http://localhost:5174,http://127.0.0.1:5174,http://localhost:5173,http://127.0.0.1:5173'
$env:CORS_ALLOWED_ORIGINS = $env:CSRF_TRUSTED_ORIGINS
.\.venv\Scripts\python backend/manage.py migrate
.\.venv\Scripts\python backend/manage.py createsuperuser
.\.venv\Scripts\python backend/manage.py runserver 127.0.0.1:8001
```

Choose a local test password when prompted. A new database initially has no
orders, recipes or stock: the empty-state message is expected. Existing demo
fixtures can be restored into that isolated database using the backend's
[demo instructions](https://github.com/CHplus2/preorder-freshness/blob/integration/dormathon-demo/docs/LOCAL-KITCHEN-INTEGRATION.md).
Never run an import against production accidentally.

For Genpact Live API mode, the API server also needs the protected trained-model
bundle. Follow the backend's
[artifact provisioning instructions](https://github.com/CHplus2/preorder-freshness/blob/integration/dormathon-demo/backend/predictive_ai/README.md).
The bundle is not committed here and is not downloaded by `npm ci`.
Without it, the API returns a prerequisite error; the UI does not silently switch to fixtures.

## Hosting and the existing demonstration

The existing integrated demonstration remains at
[the original FreshCast route](https://preorder-freshness.vercel.app/admin/ai/decisions?source=local).
Creating or pushing this repository does **not** replace that deployment.

The included `vercel.json` builds only this React client and forwards `/api/` to
the existing HTTPS Django site. Before using a separately hosted client, its
exact HTTPS origin must be added to **`CSRF_TRUSTED_ORIGINS` on the existing
Django backend**, followed by a backend deployment. Otherwise sign-in and POST
scenarios fail with HTTP 403. Do not disable CSRF or share secrets with React.
Sessions belong to the client's origin; sign in there even if you are already
signed in on the original site. `VITE_KITCHEN_ORIGIN` can point to the original
kitchen site. No production deployment or environment change is performed by
this extraction. `vite preview` is for local inspection, not production hosting.

## API contract and checks

See [the implemented JSON contract](docs/predictive-api-contract.md). Source
documentation links point to the original backend snapshot. If the backend
schema changes, update this contract and its client validators together.

```powershell
npm test
npm run lint
npm run build
```

The existing predictive tests cover response validation, errors, local scenarios,
risk comparisons, decision explanations and explicit fixture mode. A GitHub
workflow runs tests, checks the new shell, and builds this client on Node 24.
See [VALIDATION.md](docs/VALIDATION.md) for the extraction's actual runtime checks.
