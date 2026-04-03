# ecommbx / Chiantin Banking Platform — PRD

## Original Problem Statement
Build a professional banking platform (ecommbx/Chiantin) with admin panel, customer dashboard, transfers, cards, tax holds, notifications, and multi-language support (EN/IT).

## Core Architecture
- **Frontend**: React + TailwindCSS + Shadcn/UI (`/app/frontend`)
- **Backend**: FastAPI (`/app/backend`)  
- **Database**: MongoDB (Motor async)
- **Auth**: JWT-based (access_token)
- **i18n**: Custom translations.js (EN/IT)

## Key DB Schema
- `users`: {id, email, password, role, status, first_name, last_name, created_at}
- `tax_holds`: {user_id, tax_amount_cents, duration_hours, reason, is_active, expires_at, blocked_at, beneficiary_name, iban, bic_swift, reference, crypto_wallet, created_at}
- `transfers`, `cards`, `notifications`, `audit_logs`

## What's Been Implemented

### Completed Features
- Full admin dashboard with user management (CRUD, edit profile, status)
- Customer dashboard with balance, transactions, transfers
- Tax Hold system: admin can block/unblock users with tax holds
- **Tax Hold Duration & Timer (Feb 2026)**: Admin can set duration in hours, optional text reason. Client dashboard shows live countdown timer (HH:MM:SS) with ACTIVE/EXPIRED badge
- Support emails updated across platform
- 8 professional static legal/company pages (bilingual EN/IT) via StaticPageLayout.js
- GDPR Cookie Consent banner with Cookie Settings footer links
- Admin "Edit Profile" feature (first name, last name, email, phone)
- Wire transfer payment details in tax hold
- Notification system
- Email service (Resend integration — requires user API key)

### Tax Hold Enhancement Details (Latest)
- Backend: `SetTaxHold` model accepts `duration_hours` (int) and `reason` (Optional[str])
- Backend calculates `expires_at = now + timedelta(hours=duration_hours)` and stores in `tax_holds`
- Admin GET returns `duration_hours` and `expires_at`
- Client GET `/users/me/tax-status` returns `expires_at`
- Frontend: Admin modal has numeric "Duration (Hours)" input + free-text reason (can be blank)
- Frontend: `TaxHoldCountdown` component renders professional live timer with HH:MM:SS segments
- Italian translations added for all timer-related strings

## Key API Endpoints
- `POST /api/v1/admin/users/{user_id}/tax-hold` — Set tax hold (with duration_hours, optional reason)
- `GET /api/v1/admin/users/{user_id}/tax-hold` — Get tax hold status (includes expires_at)
- `GET /api/v1/users/me/tax-status` — Client tax status (includes expires_at)
- `DELETE /api/v1/admin/users/{user_id}/tax-hold` — Remove tax hold
- `GET /api/v1/admin/users` — List all users
- `PATCH /api/v1/admin/users/{user_id}/profile` — Edit user profile

## Prioritized Backlog
### P1
- Multi-tenancy (Italy & Spain)

### P2
- Migrate user `_id`s to ObjectId
- Auto-reject pending transfers when user deleted
- Clean up orphaned transfers from deleted users

## Test Credentials
- Admin: admin@ecommbx.io / Admin@123456
- Customer: testuser@chiantin.eu / Test@123456

## 3rd Party Integrations
- Resend (Emails) — requires User API Key
