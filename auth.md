# auth.md — Legacy public Ashna4all

**Scope:** Authentication, authorisation and access review guide. **Status:** DRAFT / NOT CERTIFIED (12 October 2026, Europe/London). This file grants no permissions and does not supersede existing controls.

## Governing authority
`README.md` identifies a GoalCurrent link but no confirmed application identity, authentication system or production deployment.

## Specific boundaries
- Confirm whether this repository has live authentication before claiming any login, role or session features.
- Use GitHub contributor permissions and repository protection for edits; no private Founder OS credential or session data belongs in this public repository.
- If any privileged workflow or deployment exists, identify its actual owner and test its permission boundaries separately.

## Negative-case evidence to collect
- Unauthorised repository change and unexpected token/secret exposure (review only).

## Approval and audit
Repository identity/owner unverified; hold approval. Use isolated test fixtures; record test outcomes and reviewed exact commit SHA. If a verification has not run, state **NOT RUN** rather than PASS.

Related: [security.md](security.md), [data.md](data.md), [hack.md](hack.md), [checklist.md](checklist.md).
