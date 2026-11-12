# MATT Dashboard

**standalone, unofficial prototype** 

## Project Documentation

This repository belongs to the University of Cincinnati senior design team improving the Mission Assessment Tracking Tool (MATT) for the Ohio Cyber Range Institute (OCRI).

| Document | Contents |
|---|---|
| [Project Plan](docs/PROJECT_PLAN.md) | Project direction, proposed stack, team responsibilities, build sequence, and sensitive-information rules |
| [Test Instance Review (11/11)](docs/findings/2026-11-11-test-instance-review.md) | Usability findings from the MATT test instance, mapped to requirements |
| [Database Setup](docs/DATABASE_SETUP.md) | Neon Postgres connection, migrations, and seeding |

**Reminder:** this repository is public. Do not commit real exercise data, controlled documents, server addresses, or credentials. That includes your `.env` file and the Neon connection string.

## What you get

- **Home:** event overview and navigation cards
- **Assessment:** score badges for functional areas and core tasks (counts are computed from evaluations); export sample data to CSV
- **Task Wheel:** interactive hierarchical sunburst diagram; click a segment to zoom and click the center to zoom out
- **OPFOR Dashboard:** filter by inject type, day, or Blue Team; refresh; view three workflow columns
- **JSON endpoints:** `/api/tasks`, `/api/assessment`, `/api/injects` (served from the database)
- **Database layer:** Flask-SQLAlchemy models, Flask-Migrate migrations, and a `flask seed` command for synthetic demo data
- **Basic Flask tests** (pytest, run against in-memory SQLite)

## Quick start

All commands are run from the repository root (the `MATT-SR-Capstone` folder, which contains `app.py`, `templates/`, and `static/`). Flask only finds the templates when `app.py` sits next to them.

### Windows (PowerShell)

You need **Python 3.10 or newer** and **Git**. When you install Python from [python.org](https://www.python.org/downloads/windows/), check **Add python.exe to PATH**. Check that both are ready:

```powershell
py --version
git --version
```

Then:

```powershell
git clone https://github.com/orlowscr/MATT-SR-Capstone.git
cd MATT-SR-Capstone
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Open `.env` and paste the team's Neon **pooled** connection string into `DATABASE_URL` (see [Database setup](#database-setup-neon-postgres)). Then start the app:

```powershell
python -m flask run
```

Open **http://127.0.0.1:5000** in your browser. Press **Ctrl+C** to stop the server, and run `deactivate` to leave the virtual environment.

Each new PowerShell window needs `.\.venv\Scripts\Activate.ps1` again before running commands.

If PowerShell says running scripts is disabled when you activate the environment, allow it for your user account once, then try again:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

If you use **Command Prompt** instead of PowerShell, activate with `.venv\Scripts\activate.bat`.

### macOS

```bash
git clone https://github.com/orlowscr/MATT-SR-Capstone.git
cd MATT-SR-Capstone
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env     # then paste the Neon connection string into .env
python -m flask run
```

Open **http://127.0.0.1:5000** in your browser. Use **Ctrl+C** in Terminal to stop.

You can also start the app with `python app.py`, which runs in debug mode.

## Database setup (Neon Postgres)

The app reads `DATABASE_URL` from `.env`. If it is not set, the app falls back to a local SQLite file (`instance/matt_dev.db`), so it still runs offline. Full details are in [docs/DATABASE_SETUP.md](docs/DATABASE_SETUP.md).

**Rules for the connection string and `.env`:**
- `.env` is git-ignored. Make sure `.gitignore` lists `.env`, `.venv/`, `.idea/`, `instance/`, and `__pycache__/`.
- Never commit `.env` or paste the connection string into chat, issues, or pull requests. If it leaks, reset the password in the Neon console.
- Use **synthetic data only** in the database.

**One person on the team does this once** (then commits the new `migrations/` folder):

```powershell
python -m flask db init
python -m flask db migrate -m "initial schema"
python -m flask db upgrade
python -m flask seed
```

**Everyone else** pulls the repo and runs `python -m flask db upgrade` only when a new migration appears. Running `flask seed` against a database that already has data does nothing.

**Day to day:**

| Task | Command |
|---|---|
| Check the connection | `python -c "from app import create_app; from extensions import db; a=create_app(); a.app_context().push(); print(db.session.execute(db.text('select 1')).scalar())"` |
| Apply new migrations | `python -m flask db upgrade` |
| After changing `models.py` | `python -m flask db migrate -m "what changed"`, then `python -m flask db upgrade` |
| Reload demo data | `python -m flask seed --reset` (asks for confirmation; deletes ALL rows in the connected database) |

`flask seed` prints the database it is about to use with the password hidden. Check that it shows your Neon host before using `--reset`.

## Run the tests

```powershell
python -m pip install pytest
python -m pytest -q
```

Tests use an in-memory SQLite database. They never touch Neon and do not need internet access.

## How to customize

| Want to change | File |
|---|---|
| Demo event, teams, task hierarchy, injects (seed input) | `seed_data.py`, then `python -m flask seed --reset` |
| Database tables and columns | `models.py`, then create a migration (see above) |
| How rows become JSON for the pages and API | `queries.py` |
| API routes and page routes | `app.py` |
| Database URL, engine settings, demo user | `config.py` and `.env` |
| Navigation bar / common layout | `templates/base.html` |
| Individual pages | `templates/*.html` |
| Design, colors, spacing | `static/css/style.css` |
| Filter/chart interactions | `static/js/app.js` |

Edit a Python file and Flask's development server should reload. Refresh the browser after changing HTML, CSS, or JavaScript. Changes to `seed_data.py` only appear after you reseed.

### Example: add a new inject

Append this dictionary to `INJECTS` inside `seed_data.py`:

```python
{
    "id": "INJ-006", "title": "New training inject", "type": "red",
    "day": 2, "team": "Blue Team A", "status": "not-started",
    "priority": "High", "description": "Description of the inject."
}
```

Then run `python -m flask seed --reset` to reload the database. Note that `--reset` wipes all rows in the connected database, so on the shared Neon database tell the team first, or use your own Neon branch.

Allowed `status` values: `not-started`, `running`, `stopped`. Allowed `type` values in current filters: `red` and `white`. The `team` must be one of the teams listed in `TRAINING_TEAMS` in `seed_data.py`. If you add a new team or inject type, update the dropdowns in `templates/opfor.html`.

## Project layout

```text
MATT-SR-Capstone/
├── app.py                 # app factory (create_app), page and API routes
├── config.py              # settings read from environment variables / .env
├── extensions.py          # shared db and migrate objects
├── models.py              # Event, Team, User, Node, Evaluation, Inject
├── queries.py             # database rows -> JSON shapes the frontend expects
├── seed.py                # `flask seed` command
├── seed_data.py           # synthetic demo data (fake data only)
├── requirements.txt
├── .env.example           # copy to .env (git-ignored) and fill in
├── README.md
├── docs/
│   ├── PROJECT_PLAN.md
│   ├── DATABASE_SETUP.md
│   └── findings/
├── migrations/            # created by `flask db init`; commit this folder
├── templates/
│   ├── base.html
│   ├── home.html
│   ├── assessment.html
│   ├── wheel.html
│   └── opfor.html
├── static/
│   ├── css/style.css
│   └── js/app.js
└── tests/
    ├── conftest.py
    └── test_app.py
```

## Troubleshooting

| Problem | Fix |
|---|---|
| `flask` is not recognized | Activate the venv (`.\.venv\Scripts\Activate.ps1`), or run it as `python -m flask ...` |
| `No module named pip` | Run `py -m ensurepip --upgrade`, or rebuild the venv with `py -m venv .venv` |
| `jinja2.exceptions.TemplateNotFound` | You are not running from the repo root. `app.py`, `templates/`, and `static/` must be in the same folder. Run `git pull` if the `templates/` folder is missing |
| `Could not open requirements file` | Check the spelling (`requirements.txt`) and that you are in the repo root |
| Output says `Database: sqlite:///matt_dev.db` | `.env` is not being read. It must be named exactly `.env` and sit in the repo root |
| `relation does not exist` / `no such table` | Run `python -m flask db upgrade` |
| `/api/tasks` returns `[]` | The tables exist but are empty. Run `python -m flask seed` |
| First request after a pause is slow or fails | Neon's free tier suspends idle compute. Retry after a few seconds |
| `db upgrade` fails through the pooled host | Temporarily use Neon's **direct** connection string in `.env` for that command |

## Important notes

- Task wheel uses **D3 v7 from a public CDN**. It requires internet access on first load. To use offline, download D3 locally and replace the script source in `templates/base.html`.
- The Flask server runs in **development mode**; do not expose it publicly. There is **no authentication or authorization yet**: `DEMO_USER` in `config.py` stands in for the signed-in user, and the `User` and `assessor_teams` tables are in place for the upcoming role-based and team-based permissions.
- Buttons marked DEMO and the CHAT placeholder are not attached to real accounts or services.
- OPFOR records and evaluations are read-only in the UI for now; the pages show whatever is in the database. Write endpoints, auth, and the MSEL import are still to be built.
- `Node.status` (used to color the wheel) is stored directly and is not yet derived from evaluations.
- Before production deployment, add authentication, role-based permissions, CSRF protection, input validation, audit logs, and secure server configuration.
