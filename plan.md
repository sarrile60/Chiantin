# Project Atlas – Two-Phase Build Plan (POC → Full App)

Note: Use codename “Project Atlas” in all UI copy via a single config. Tech stack: FastAPI + MongoDB + React + TypeScript + Tailwind + PWA.

## 1) Objectives
- Deliver a production-grade EU fintech-style platform (Customer Web + Admin Portal + PWA) with sandbox-only rails.
- Core-first: bulletproof double-entry ledger (append-only, reversals, idempotency). No “set balance”.
- Security/RBAC foundation: hybrid JWT (access) + httpOnly refresh cookie, MFA (TOTP), sessions/devices, rate-limit, audit logs.
- KYC pipeline with S3-first storage adapter (MinIO/local fallback) and admin review.
- Accounts + IBAN sandbox adapter, transactions UI, statements (WeasyPrint), CSV export.
- Clean, minimal banking UX, responsive, light/dark theme, offline-safe PWA.

## 2) Implementation Steps

### Phase 1 – Core POC (Isolated, fix-until-green)
Purpose: Prove the hardest part(s) work in isolation before app build.

Scope (single Python test script covering all core checks):
- Ledger engine: double-entry invariants, append-only, derived balances, reversals, idempotency keys, transaction statuses.
- Idempotency store: repeated calls with same key are safe.
- S3 adapter: interface + local fallback (mocked/minio-like) upload/download smoke.
- Auth primitives: JWT access issue/verify + refresh rotation model, TOTP generation/verification.
- Audit event emission hook (no full pipeline yet).

Planned actions:
1) Research (web search): latest best practices on double-entry ledger invariants and reversal patterns in financial systems; FastAPI cookie-based refresh patterns; WeasyPrint production hints; S3-compatible adapters with MinIO fallback.
2) Define minimal Pydantic models for: ledger_accounts, ledger_transactions, ledger_entries, idempotency_keys.
3) Implement ledger_posting engine with guards:
   - debit == credit per transaction, statuses: pending → posted → reversed
   - append-only entries; reversals create new symmetrical entries linked to original
   - balance = sum(entries) by account; no update endpoints
4) Implement idempotency store (collection with TTL/indexes) and middleware helper.
5) Implement S3Storage adapter interface + LocalS3 fallback (filesystem-backed) with same API shape.
6) Implement minimal auth helpers: JWT issue/verify, refresh rotation logic (no endpoints yet), TOTP using shared secret.
7) Write ONE test script (tests/test_core_atlas.py) covering:
   - top_up, withdraw, fee, internal_transfer → invariants hold
   - idempotency key prevents duplicate posting
   - reversal creates new entries and restores prior balance
   - derived balances match expectations
   - S3 put/get OK
   - TOTP verifies and JWT refresh rotates token metadata
8) Run and fix until all green. Do not proceed with app until 100% pass.

Deliverables (Phase 1):
- /app/backend/core/ledger/*.py, /app/backend/core/auth/*.py, /app/backend/providers/storage/*.py
- tests/test_core_atlas.py with passing tests
- Decision notes from research embedded as docstrings/README

User Stories (Phase 1):
1. As Finance Ops, I can top up a user account using an idempotency key and see correct balances.
2. As Finance Ops, I can reverse a posted transaction and balances adjust via new entries.
3. As Compliance Officer, I can view an emitted audit event for a test ledger adjustment.
4. As an Engineer, I can rerun the core test script and see all invariants consistently pass.
5. As an Admin, I cannot “set balance”; any attempt is rejected by the engine.

---

### Phase 2 – Full App Development (MVP: Phases 1–3 from spec)
Build around proven core. All endpoints under /api/v1. Strict RBAC + ownership checks. Beautiful, responsive UI (Customer + Admin) with PWA.

Backend modules (FastAPI):
- auth: users, roles, permissions, sessions/devices, mfa_devices (TOTP), consents; login/signup/OTP, refresh rotation, device list/revoke, password policy/lockouts, rate limit, CSRF/CORS.
- audit: audit_logs with before/after snapshots, actor, targets, request meta, correlation IDs.
- kyc: customer_profiles, kyc_applications, kyc_documents (S3 URIs), kyc_reviews, status flow, risk placeholders; document upload via S3 adapter; consent tracking.
- banking: bank_accounts (EUR), iban_details (sandbox adapter), statements (WeasyPrint HTML→PDF), CSV export.
- ledger: expose posting endpoints (top up, withdraw, fee, internal transfer), reversal API, idempotency middleware; balances are derived only.
- support: tickets, ticket_messages, attachments (S3 URIs).
- notifications: in-app notifications; email provider interface (mock in MVP).
- admin tools: feature_flags, config_limits (max per action/day), revocations, disable user, force reset.
- common: serialization helpers (ObjectId/datetime), error format, rate limiting, OpenAPI docs.

Adapters/Providers:
- StorageProvider: S3-first (boto3-like), LocalS3 fallback.
- CoreBankingAdapter: sandbox IBAN issuance (realistic test format).
- EmailProvider/SMSProvider: interfaces with mock implementations.

Database (MongoDB):
- Collections per spec: auth/*, kyc/*, banking/*, ledger/*, support/*, admin/* with necessary indexes (email unique, session TTL, idempotency keys, audit chronological). No hard-coded DB name; env-driven.

Frontend (React + TypeScript + Tailwind + shadcn/ui):
- Customer app routes: Home, Accounts, Activity, Support, Profile.
- Admin portal routes: Users, KYC, Accounts, Ledger Tools, Transactions, Audit Logs, Support, Settings.
- Features: signup/login with TOTP step-up, device list/revoke, KYC forms + doc upload, account/IBAN view, transactions list/filters, transaction details, statements PDF/CSV download, notifications center, support tickets.
- Theme: light/dark toggle; responsive layouts; delightful interactions; all interactive elements include data-testid.
- PWA: service worker, manifest, install prompts, offline-safe caches (no sensitive data).

Security & Compliance:
- MFA (TOTP) enforced, lockouts/rate-limit, secure cookies for refresh, CSRF for cookie flows, input validation.
- Encryption-at-rest plan for sensitive fields (basic encryption for secrets, TOTP seeds).
- PSD2/SCA-ready: step-up hooks for sensitive operations (admin money tools).

Seeding & Ops:
- Seed script: Super Admin via SEED_SUPERADMIN_EMAIL/PASSWORD; internal ledger accounts; demo users.
- Statements scheduler (monthly) stub; exports; consistent structured logging with correlation IDs.

Testing & QA:
- Call testing agent for E2E: auth flows, KYC upload/review, ledger postings/reversal, statements generation, RBAC enforcement, admin tools, PWA install flow (skip camera).
- Linting and type checks (ruff/eslint/tsc).

User Stories (Phase 2):
1. As a customer, I can sign up, enroll TOTP, and log in with step-up.
2. As a customer, I can view my devices and revoke any session.
3. As a customer, I can submit KYC with documents and track status.
4. As a compliance officer, I can review KYC and approve/reject with notes (audited).
5. As a finance ops user, I can top up/withdraw/fee/transfer with reason and idempotency.
6. As finance ops, I can reverse a posted transaction and see linked reversal entries.
7. As a customer, I can view transactions, filter, and open details showing ledger entries.
8. As a customer, I can download a monthly statement PDF and CSV export.
9. As a support agent, I can manage support tickets and reply with attachments.
10. As an admin, I can view audit logs for all sensitive actions.
11. As a user, I receive in-app notifications for KYC updates, login alerts, and balance changes.
12. As a user, I can install the PWA and use it responsively with dark mode.

## 3) Next Actions (Immediate)
1. Initialize backend core modules and schemas; create LocalS3 adapter skeleton.
2. Implement ledger posting engine + idempotency store.
3. Write tests/test_core_atlas.py covering ledger/idempotency/S3/JWT/TOTP.
4. Run POC tests and fix until green.
5. After green: call design agent, implement full backend + frontend in parallel; seed data; end-to-end test via testing agent.

## 4) Success Criteria
- Phase 1: All core tests pass (ledger invariants, reversals, idempotency, S3 smoke, JWT/TOTP). No direct balance mutation anywhere.
- Phase 2: End-to-end flows working across Customer and Admin portals; strict RBAC; audit logs for all admin actions; monthly PDF and CSV exports; PWA installable; no red screen errors; API under /api/v1; environment variables respected; testing agent passes all user stories.
