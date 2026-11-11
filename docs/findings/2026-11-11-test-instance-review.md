# MATT Test Instance Review: Usability Findings

**Date:** November 11, 2026 · **Reviewed by:** Luke Link · **Environment:** MATT test instance, Capstone Course event · **Related:** issue #2, issue #9

## Purpose

To check the requirements gathered in the 10/15 and 10/22 sponsor meetings against the current application, from an assessor's point of view. The review covered the Home page, Views menu, Team Assessment Wheel, and Measure Evaluations. It was observation only: no data was created, changed, or imported.

> Details about the existing system's configuration, accounts, and infrastructure are left out of this public document on purpose. They will be shared directly with the faculty advisor.

---

## Findings

### Finding 1: Home page and navigation

- The Home page mostly holds links to reference documents. Assessors still have to open the **Views** menu, which has 15 entries, to reach the two screens they use most: the Team Assessment Wheel and Measure Evaluations.
- **Impact:** extra steps for every assessor, and a learning curve for volunteers who use MATT once a year.
- **Recommendation:** put the Wheel and Measure Evaluations on the Home page as primary actions, and show other views based on role.

### Finding 2: Assessment wheel readability

- At full depth, the wheel's outer rings are too dense to read. Labels overlap and the segments merge into a solid band.
- The wheel is taller than a standard laptop screen, so users have to scroll to see all of it.
- The legend explains the status colors but doesn't identify segments.
- **Impact:** the wheel works for a quick overview but not for finding a specific measure. This matches the 10/22 user feedback.
- **Recommendation:** label segments with hover or tap, size the wheel to the screen, and limit how many rings show at once.

### Finding 3: Assessment wheel navigation

- A **Reset Wheel** control exists, but there is no step-back control. Moving up one level means clicking the center of the wheel, and nothing on screen tells the user this.
- The deepest level of the wheel offers no action, so a user can't open the evaluation for a selected measure.
- **Impact:** assessors write down measure codes and look them up again on Measure Evaluations (described on 10/22).
- **Recommendation:** add back and forward controls, and make each measure open its evaluation directly.

### Finding 4: Measure Evaluations list

- The list shows every measure-and-inject combination for the event (571 rows in the test event), 10 rows per page by default, with links to only the first 7 pages.
- Rows can be filtered by column, but not grouped by play card.
- The **Measure Status** column shows the workflow state (for example *Not Started* or *In Progress*) but not what the assessor wrote.
- **Impact:** assessors have to search for the measures on the current play card, which leads to entries in the wrong row (described on 10/22).
- **Recommendation:** group evaluations by play card and by day, and show a preview of the assessor's comments in the list.

### Finding 5: Team selection

- The **Team Filter** on Measure Evaluations starts on *All*, so every team's measures appear in one list.
- **Impact:** this makes it easy to evaluate the wrong team, which was the top problem raised on 10/22.
- **Recommendation:** assign assessors to teams, and limit what they see and can enter to their assigned team(s).

### Finding 6: Client-side error

- One of the application's JavaScript libraries fails to load on every page and shows an error in the browser console.
- **Impact:** any feature that relies on that library may not work.
- **Recommendation:** no action for the existing system. Noted as a reliability issue.

---

## Summary

| # | Finding | Requirement addressed | Build step |
|---|---|---|---|
| 1 | Home page and navigation | Simplified, role-based home page | Steps 3–4 |
| 2 | Wheel readability | Wheel labels and legend | Step 5 |
| 3 | Wheel navigation | Back navigation; wheel opens evaluation | Steps 4–5 |
| 4 | Measure Evaluations list | Group by play card; show assessor input | Step 4 |
| 5 | Team selection | Team-based permissions | Step 3 |
| 6 | Client-side error | Reliability | — |

Build steps refer to the [Project Plan](../PROJECT_PLAN.md).
