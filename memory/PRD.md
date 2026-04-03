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
- Tax Hold system with duration timer, optional reason dropdown, live countdown
- **Tax Hold Duration & Timer**: Admin sets duration in hours; client sees live countdown (DD:HH:MM:SS)
- **Tax Hold Reminder Email**: Admin can send payment reminder email to user with real-time remaining in EN or IT
- **Custom Tax Alert Modal**: Professional "Chiantin Bank" branded modal replaces native browser alerts
- **Guarded Navigation**: All dashboard navigation blocked when tax hold active, shows Chiantin Bank popup
- **Mobile Auto-Translate Fix**: Prevents Chrome/Samsung auto-translate from corrupting button text
- Support emails updated across platform
- 8 professional static legal/company pages (bilingual EN/IT) via StaticPageLayout.js
- GDPR Cookie Consent banner with Cookie Settings footer links
- Admin "Edit Profile" feature
- Wire transfer payment details in tax hold
- Notification system
- Email service (Resend integration — requires user API key)

### Key API Endpoints
- `POST /api/v1/admin/users/{user_id}/tax-hold` — Set tax hold
- `GET /api/v1/admin/users/{user_id}/tax-hold` — Get tax hold status
- `POST /api/v1/admin/users/{user_id}/tax-hold/reminder` — Send reminder email (language: en/it)
- `DELETE /api/v1/admin/users/{user_id}/tax-hold` — Remove tax hold
- `GET /api/v1/users/me/tax-status` — Client tax status

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
- Resend (Emails) — requires User API Key (RESEND_API_KEY, SENDER_EMAIL in backend/.env)
