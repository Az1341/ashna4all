# security.md — Legacy public Ashna4all repository

**Classification:** Non-authoritative control-review guide. **Status:** DRAFT / NOT CERTIFIED, 12 October 2026 (Europe/London). This document neither certifies existing controls nor authorises new security tests or production changes.

## Source of authority
Public README only; repository function, deploy mapping and source-of-truth status unverified. If there is a conflict, reconcile the authoritative implementation and approved decisions; do not elevate this summary to a second Source of Truth.

## Priority threats to review
- Public accidental publication of private founder data, token leakage, and incorrect assumption this is the Founder OS source.
- Unreviewed direct changes to public branch or unclear release ownership.

## Security boundaries to preserve
- Hold any product-specific policy adoption until owner and canonical source are identified.
- Only public repository hygiene and least-privilege GitHub reviews are in scope. No private credentials or data.

## Evidence and incident treatment
- Collect reproducible scoped findings and exact commit SHA using synthetic or redacted evidence. No live penetration test authorised by this file.
- Never include API keys, tokens, personal records or exploit artefacts with real data in repository documentation.
- For exposure or a serious finding, preserve evidence, restrict access and use established incident/credential-response procedures with the appropriate owner.
- Verify a fix in isolation; an unrun check is **NOT RUN**, never PASS.

**Release decision:** HOLD. Resolve identity and confirm whether repository should stay active before any merge.

Related: [auth.md](auth.md), [data.md](data.md), [hack.md](hack.md), [checklist.md](checklist.md).
