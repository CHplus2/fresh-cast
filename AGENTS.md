# FreshCast standalone client

- Work on `feature/standalone-freshcast` unless the user selects another branch.
- Preserve the original `preorder-freshness` checkout and Git history.
- Keep source attribution and reuse disclosures accurate. Never backdate commits,
  rewrite source history, or suggest that extraction establishes hackathon eligibility.
- Reuse the existing decision-assistant behavior and authoritative backend schema.
- Django is an external service. React contains no database, model or staff secrets.
- Distinguish database planning, Genpact model inference and frontend fixtures.
- Do not deploy, modify production records, merge into main, push directly to main,
  or force-push without the user's explicit applicable instruction.
- Do not commit credentials, environment files, databases, datasets, model artifacts,
  build output or dependency directories.
- Run `npm test`, `npm run lint` and `npm run build` for relevant client changes;
  verify authentication and real API responses when changing connectivity.
