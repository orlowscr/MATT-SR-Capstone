# MATT Dashboard

**standalone, unofficial prototype** 

## Project Documentation

This repository belongs to the University of Cincinnati senior design team improving the Mission Assessment Tracking Tool (MATT) for the Ohio Cyber Range Institute (OCRI).

| Document | Contents |
|---|---|
| [Project Plan](docs/PROJECT_PLAN.md) | Project direction, proposed stack, team responsibilities, build sequence, and sensitive-information rules |
| [Test Instance Review (11/11)](docs/findings/2026-11-11-test-instance-review.md) | Usability findings from the MATT test instance, mapped to requirements |

**Reminder:** this repository is public. Do not commit real exercise data, controlled documents, server addresses, or credentials.

## What you get

- **Home:** event overview and navigation cards
- **Assessment:** score badges for functional areas and core tasks; export sample data to CSV
- **Task Wheel:** interactive hierarchical sunburst diagram; click a segment to zoom and click the center to zoom out
- **OPFOR Dashboard:** filter by inject type, day, or Blue Team; refresh; view three workflow columns
- **JSON endpoints:** `/api/tasks`, `/api/assessment`, `/api/injects`
- **Basic Flask tests** (pytest)

## Run on macOS

```bash
git clone https://github.com/orlowscr/MATT-SR-Capstone.git
cd MATT-SR-Capstone
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python app.py
```

Open **http://127.0.0.1:5000** in your browser. Use **Ctrl+C** in Terminal to stop.

Run tests:

```bash
python -m pip install pytest
python -m pytest -q
```

## Run on Windows

You need **Python 3.10 or newer** and **Git**. When you install Python from [python.org](https://www.python.org/downloads/windows/), check **Add python.exe to PATH**. Check that both are ready:

```powershell
py --version
git --version
```

Then, in **PowerShell**:

```powershell
git clone https://github.com/orlowscr/MATT-SR-Capstone.git
cd MATT-SR-Capstone
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python app.py
```

Open **http://127.0.0.1:5000** in your browser. Press **Ctrl+C** in PowerShell to stop the server, and run `deactivate` to leave the virtual environment.

If PowerShell says running scripts is disabled when you activate the environment, allow it for your user account once, then try again:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

If you use **Command Prompt** instead of PowerShell, activate with `.venv\Scripts\activate.bat`.

If a page shows `jinja2.exceptions.TemplateNotFound`, your copy is missing the `templates/` folder. Run `git pull` to get the latest files, and make sure you start `python app.py` from the repository folder (the one that contains `templates/` and `static/`).

Run tests:

```powershell
python -m pip install pytest
python -m pytest -q
```

## How to customize

| Want to change | File |
|---|---|
| Event name, day, user | `data.py` → `EVENT` |
| Assessment numbers | `data.py` → `TEAMS` |
| Circle/wheel task hierarchy | `data.py` → `TASKS` |
| OPFOR injects and statuses | `data.py` → `INJECTS` |
| Navigation bar / common layout | `templates/base.html` |
| Individual pages | `templates/*.html` |
| Design, colors, spacing | `static/css/style.css` |
| Filter/chart interactions | `static/js/app.js` |
| API routes | `app.py` |

Edit a Python file and Flask's development server should reload. Refresh the browser after changing HTML, CSS, or JavaScript.

### Example: add a new inject

Append this dictionary to `INJECTS` inside `data.py`:

```python
{
    "id": "INJ-006", "title": "New training inject", "type": "red",
    "day": 2, "team": "Blue Team A", "status": "not-started",
    "priority": "High", "description": "Description of the inject."
}
```

Allowed `status` values: `not-started`, `running`, `stopped`. Allowed `type` values in current filters: `red` and `white`. If you add a new team or inject type, update the dropdowns in `templates/opfor.html`.

## Project layout

```text
MATT-SR-Capstone/
├── app.py
├── data.py
├── requirements.txt
├── README.md
├── templates/
│   ├── base.html
│   ├── home.html
│   ├── assessment.html
│   ├── wheel.html
│   └── opfor.html
├── static/
│   ├── css/style.css
│   └── js/app.js
└── tests/test_app.py
```

## Important notes

- Task wheel uses **D3 v7 from a public CDN**. It requires internet access on first load. To use offline, download D3 locally and replace the script source in `templates/base.html`.
- The Flask server runs in **development mode**; do not expose it publicly. There is no authentication or authorization.
- Buttons marked DEMO and the CHAT placeholder are not attached to real accounts or services.
- OPFOR records are read-only mock data, so auto-refresh reloads the same dataset unless `data.py` changes.
- Before production deployment, use a database, authentication, role-based permissions, CSRF protection, input validation, audit logs, and secure server configuration.
