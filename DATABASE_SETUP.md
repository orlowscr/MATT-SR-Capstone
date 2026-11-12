# Database setup (Neon Postgres)

The app reads `DATABASE_URL` from the environment. Without it, it falls back to a local SQLite file
(`instance/matt_dev.db`), so you can still run everything offline.

## One-time per developer
1. Copy `.env.example` to `.env` and paste your Neon **pooled** connection string into `DATABASE_URL`.
   `.env` is git-ignored. Never commit it, and never paste it into chat, issues, or PRs.
   If a string leaks, reset the password in the Neon console right away (git history keeps it).
2. `python -m pip install -r requirements.txt`

## One-time per team (ONE person does this, then commits the `migrations/` folder)
```bash
flask db init
flask db migrate -m "initial schema"
flask db upgrade
flask seed
```
Everyone else just pulls and runs `flask db upgrade` only if a new migration was added.
If a migration fails through the pooled host, temporarily use the Neon **direct** connection string for that command.

## Day to day
- Run the app: `python app.py` (or `flask run`)
- Change a model in `models.py`, then `flask db migrate -m "what changed"` and `flask db upgrade`
- Reload demo data: `flask seed --reset` (asks for confirmation; wipes ALL rows in the connected database)
- Tests use in-memory SQLite and never touch Neon: `python -m pytest -q`

## Rules
- Synthetic data only. No real exercise data, controlled documents, or server addresses in the database or the repo.
- Prefer a Neon branch per developer so one person's schema change or reseed does not break everyone.
