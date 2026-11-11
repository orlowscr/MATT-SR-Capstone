# MATT Assessor UI — Angular starter

**Unofficial training prototype for senior design.** This contains invented sample data, not OCRI data or proprietary MATT source. It is not an authenticated production application.

## Prerequisites

- Node.js 22.12+ (Angular 21 supported range) or another Node version supported by Angular 21
- npm

## Run on macOS

```bash
cd matt-angular-starter
npm install
npm start
```

Open https://localhost:4000. Dependencies require internet access during `npm install`.

## Features

- `/` home
- `/assess` team/day/play-card filters, measure guidance, rating and comments, save confirmation, existing comment preview
- `/wheel` D3 sunburst with drill-down, Back (one level), Reset (root), click measure to navigate to assessment
- shared in-memory `EvaluationService` and typed models; **all edits disappear on reload**

## Source map

| File | Use |
|---|---|
| `src/app/models.ts` | API contract draft interfaces |
| `src/app/mock-data.ts` | Public fictional tasks, teams, cards, guidance |
| `src/app/evaluation.service.ts` | Local read/write logic to replace with API calls |
| `src/app/assessor.component.ts` | Srithan's Step 4 evaluation screen |
| `src/app/wheel.component.ts` | Sam's Step 5 wheel reference |
| `src/app/app.routes.ts` | Page routes |
| `src/styles.css` | Shared styling |

## Proposed API contract — DISCUSS WITH TEAM, NOT IMPLEMENTED

| Method | Example route | Purpose |
|---|---|---|
| GET | `/api/me` | Current user, role and assigned teams |
| GET | `/api/exercises/{exerciseId}/teams` | Teams authorized for this user |
| GET | `/api/teams/{teamId}/play-cards?day=2` | Play cards filtered by team/day |
| GET | `/api/teams/{teamId}/measures` | Assigned task hierarchy and assessor guidance |
| GET | `/api/teams/{teamId}/evaluations?day=2` | Existing evaluations and comments |
| PUT | `/api/teams/{teamId}/evaluations/{measureId}?playCardId=pc-b` | Upsert rating/comment for measure/card |

**Important:** The server must authorize each request, enforce team scope, and identify the current user; front-end filters are not access controls. Team should decide the actual route shapes, identifiers, conflict behavior, and whether an evaluation is unique by `(teamId, measureId, playCardId)`.

### Example proposed PUT JSON body

```json
{
  "rating": "YELLOW",
  "comment": "Access review underway."
}
```

A real implementation also needs an authenticated HTTP client, loading/error handling, input validation, audit fields, concurrency rules, and tests. Do not add real access tokens or sponsor data to source control.

## Suggested first changes

1. Ask Xuhui to finalize core task/task/measure and play-card relations.
2. Agree on API endpoints with Luke and Cooper before replacing mock service.
3. Add loading, error, and server validation states to the assessor form.
4. Decide how assessments marked Not Assessed should be represented and reported.
5. Add Angular unit tests and CI once team environment is agreed.

To build for deployment, run `npm run build`. Configure production environment and API endpoints only after team review.
