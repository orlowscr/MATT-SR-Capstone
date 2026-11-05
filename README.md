# MATT Senior Design Capstone

University of Cincinnati senior design project (2026–2027) to improve the **Mission Assessment Tracking Tool (MATT)**, the assessment and exercise-tracking platform used by the Ohio Cyber Range Institute (OCRI).

## About MATT

MATT helps cyber exercise staff record and review how training audiences perform during an exercise. Its main users are:

- **Assessors**, who enter observations and ratings during an exercise
- **Technical observers and observer/controllers (O/Cs)**, who watch events and add comments
- **Assessment leads**, who manage objectives and review results across the team

## Project Goals

Our aim is to make MATT faster and easier to use without changing what it is for.

**Priority goals**

1. **Faster data entry.** Cut the number of steps an assessor needs to record an observation, and clearly confirm when data is saved.
2. **Role-based interface.** Show assessors and assessment leads the tools they each need, and hide what they don't.
3. **Flexible structure.** Let teams define their own tasks, measures, and objectives instead of being limited to fixed DoD terms (METL, MET, MSEL).

**Stretch goals**

- A more forgiving MSEL Excel import, with a preview and an error summary
- An assessment wheel you can click into for detail
- Comments you can filter
- A clearer, more readable Assessment Team Report
- Separate production and development environments

**Out of scope**

- Re-architecting the whole system
- Migrating historical exercise data
- DoD accreditation

## Repository Contents

| Path | What it is |
| --- | --- |
| `MATT_Senior_Design_Team_Contract.docx` | Team contract, including requirements, roles, and expectations |
| `10_8 Meeting Minutes.pdf`, `10_15 Meeting Minutes.pdf`, `10_22_Meeting_Minutes.pdf` | Notes from team and sponsor meetings |
| `.github/ISSUE_TEMPLATE/` | Templates for bug reports, research tasks, and project tasks |

Source code will be added here once the team settles on its approach.

## How We Work

We track all work in [GitHub Issues](../../issues). When you open an issue, choose a template:

- **Bug Report** for a defect or unexpected behavior
- **Research & Requirements** for questions, sponsor decisions, and technical discovery
- **Project Task** for a piece of work with a clear deliverable

Milestones group issues by phase, starting with **M1: Requirements Baseline**.

## Handling Sensitive Information

This repository is **public**. Please do not commit or attach:

- Real exercise data, logs, or screenshots containing it
- Controlled documents (for example, anything marked FOUO or with limited distribution)
- Passwords, keys, server addresses, or other credentials

Use approved sample data for testing and examples. Share controlled material only through channels the sponsor has approved.

## Team

- Sam Anderson
- Luke Link
- Srithan Mopuru
- Noah Nguyen
- Cooper Orlowski
- Xuhui Zou

**Faculty advisor:** Samuel Bricking
**Sponsor:** Ohio Cyber Range Institute (OCRI), University of Cincinnati
