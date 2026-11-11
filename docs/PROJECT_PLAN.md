# MATT Senior Design: Project Plan

**Status:** Draft for team review · **Last updated:** November 11, 2026 · **Milestone:** M1 – Requirements Baseline

This document records the project direction, team responsibilities, and build sequence agreed on November 11, 2026. It builds on the 10/8, 10/15, and 10/22 sponsor meetings and the team's review of the MATT test instance ([findings](findings/2026-11-11-test-instance-review.md)).

---

## 1. Project Direction

The team proposes to build a focused **assessor application**. It will cover the workflow assessors and assessment leads use during live exercises: recording evaluations, reviewing team performance on the assessment wheel, and producing reports.

The direction follows the two priorities end users named in the 10/22 meeting: **quick data entry** and **readable reporting**.

> **Pending approval:** The team contract lists "re-architecting the whole system" as out of scope. Before development begins, the team will confirm this scoped approach with the faculty advisor and the sponsor.

### Proposed technology stack

| Layer | Technology | Rationale |
|---|---|---|
| Back end | Java, Spring Boot, Spring Security | Matches the architecture of the existing system, which keeps the data model and behavior close to the original |
| Database | MongoDB | Matches the existing system's data store |
| Front end | Angular (current version) | A maintained successor to the framework used in the existing system |
| Assessment wheel | D3.js | Same charting library the existing wheel uses |
| Environments | Docker Compose | One consistent environment for every developer, with separate development and production settings |

The current Flask prototype in this repository remains useful as a reference for page layout and the wheel. Moving to the stack above needs team confirmation.

---

## 2. Team Responsibilities

| Team member | Responsibility |
|---|---|
| Xuhui Zou | Project lead; data model (Step 2) |
| Luke Link | Back-end and cloud architecture; authentication and team-based permissions (Step 3) |
| Cooper Orlowski | Repository owner and meeting records; authentication and team-based permissions (Step 3) |
| Srithan Mopuru | Project foundation (Step 1); evaluation API and assessor screen (Step 4) |
| Noah Nguyen | Project foundation and environments (Step 1) |
| Sam Anderson | Assessment wheel (Step 5) |

**Faculty advisor:** Samuel Bricking · **Sponsor:** Ohio Cyber Range Institute (OCRI), University of Cincinnati

---

## 3. Build Sequence

| Step | Scope | Owner(s) | Depends on |
|---|---|---|---|
| **1. Foundation** | Repository structure; Spring Boot, MongoDB, and Angular setup; Docker Compose; separate development and production settings; approved sample data | Srithan Mopuru, Noah Nguyen | None |
| **2. Data model** | Exercise, Team, User (role and assigned teams), Core Task → Task → Measure (with an assessor guidance field), Inject / Play Card (with measure codes), Measure Evaluation | Xuhui Zou | Step 1 (design can begin now) |
| **3. Authentication and team-based permissions** | Login; Assessor, Assessment Lead, and Administrator roles; assessors limited to their assigned team(s), enforced on the server | Luke Link, Cooper Orlowski | User and Team models from Step 2 |
| **4. Evaluation API and assessor screen** | Evaluations grouped by play card and day; assessor comments shown in the list; clear confirmation when an entry is saved | Srithan Mopuru | Steps 2 and 3 (can start with mock data) |
| **5. Assessment wheel** | Readable labels, back and reset navigation, and selecting a measure opens its evaluation | Sam Anderson | Mock data first, then the Step 4 API |
| **Later** | Report export (includes comments, leaves out unevaluated items); data import with validation, preview, and row-level error reporting | To be assigned | Steps 4 and 5 |

### Working agreements

- **API contract first:** each owner adds their endpoints to a shared API list during week 1, so front-end and back-end work proceed against the same definitions.
- **Mock data:** front-end work (Steps 4 and 5) begins with mock data and connects to the live API when it is ready.
- **Shared evaluation format:** Steps 4 and 5 use the same evaluation data format, so selecting a measure on the wheel opens the same record shown on the assessor screen.
- **Issue tracking:** each step is tracked as a GitHub issue under the appropriate milestone.

---

## 4. Requirements Traceability

| Requirement (source) | Addressed in |
|---|---|
| Assessors see only their assigned team (10/22) | Step 3 |
| Selecting a measure on the wheel opens its evaluation (10/22) | Steps 4 and 5 |
| Wheel labels, legend, and back navigation (10/22; issue #9) | Step 5 |
| Evaluations grouped by play card; assessor input visible in the list (10/22) | Step 4 |
| Per-measure assessor guidance field (10/22) | Steps 2 and 4 |
| Task lists assigned per team rather than per event (10/15, 10/22) | Step 2 |
| Readable report export with comments (10/22) | Later |
| Flexible imports and alphanumeric event IDs (10/15) | Later |
| Separate production and development environments (contract) | Step 1 |

---

## 5. Open Items

- Confirm the scoped approach with the faculty advisor and the sponsor.
- Confirm the technology stack as a team.
- Confirm the play card structure and who can edit play cards.
- Confirm the final report format with end users.
- Agree on milestone due dates.

---

## 6. Handling Sensitive Information

This repository is **public**. Do not commit or attach:

- Real exercise data, logs, or screenshots containing it
- Controlled documents, including MATT user and administration guides
- Server addresses, credentials, account details, or internal API information for the existing system

Use approved sample data only. Share controlled material through channels the sponsor has approved.
