# ecommbx / Chiantin Banking Platform - PRD

## Original Problem Statement
A full-stack banking application (React frontend + FastAPI backend + MongoDB) serving real banking clients. Operates under two brands: **ecommbx** (online-ecommbx.com) and **Chiantin** (chiantin.im), both sharing the same database.

## Tech Stack
- **Frontend:** React, TailwindCSS, Shadcn/UI, hosted on Vercel (2 instances)
- **Backend:** FastAPI (Python), hosted on Railway (2 instances)
- **Database:** MongoDB Atlas (ecommbx-prod) — shared between both brands
- **Email:** Resend (separate sending domains per brand)
- **File Storage:** Cloudinary

## Dual Brand Setup
| | ecommbx | Chiantin |
|---|---|---|
| Domain | online-ecommbx.com | chiantin.im |
| GitHub | sarrile60/Bank | financebracci-alt/chiantin |
| Vercel | bank-oume | chiantin project |
| Railway | Bank service | Chiantin service |
| Sender Email | noreply@online-ecommbx.com | noreply@chiantin.im |
| Database | ecommbx-prod (shared) | ecommbx-prod (shared) |

## Completed Features (March 2026)
1. **Domain Change Notification** — Admin sends email to one/all users about domain change
2. **Dark Mode Email Fix** — All 7 email templates render correctly in dark mode clients
3. **Chiantin Rebrand** — Full rebrand with new PWA icons, emails, manifest, UI
4. **Transaction Date on Credit** — Admin can set custom date when crediting accounts
5. **Deleted User Display** — Transfers from deleted users show "Deleted User (ID...)"
6. **Desktop Change Password** — Settings gear icon in desktop header links to Security page

## Previously Completed
- File viewing in new tab (Cloudinary proxy)
- Production login CORS fix
- Password verification fix for admin-created users
- Allow duplicate IBANs
- Vercel build fixes
- Full database backup

## Known Technical Debt
- **Dual _id format:** Admin-created users have string _id, self-registered have ObjectId
- **CORS:** Uses `allow_origin_regex=r".*"` for credentialed requests

## Backlog / Future Tasks
- **P2:** Multi-tenancy (Italy & Spain)
- **P2:** Migrate all user _ids to ObjectId
- **P3:** Auto-reject pending transfers when user is deleted
- **P3:** Clean up 7 orphaned transfers from deleted users

## Test Credentials
- **Admin:** admin@ecommbx.io / Admin@123456
- **Test User:** ashleyalt004@gmail.com / 12345678
