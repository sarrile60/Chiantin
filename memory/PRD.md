# ECOMMBX Banking Platform - PRD

## Original Problem Statement
Full-stack banking application with KYC, transfers, admin panel, and notification systems.

## Current Status: STABLE (Ready for Production Deploy)

## What's Been Implemented

### Core Features
- User authentication (signup, login, MFA)
- KYC application submission and admin review
- Banking transfers with admin queue
- Support ticket system
- Tax hold management
- Admin notification badge system (database-backed)
- Admin ledger operations (credit/debit accounts)

### Recent Hotfixes (February 2026)
1. **KYC Admin Review Actions** - Fixed API contract mismatch
2. **Client KYC Submission** - Fixed endpoint routing
3. **Tax Hold Restrictions** - Restored frontend/backend enforcement
4. **Admin Panel UI Overflow** - Fixed CSS layout issues
5. **Admin Sidebar Badges** - Verified working, fixed KYC status query
6. **Admin Credit Account Blank Page** - Fixed amount→amount_cents field mismatch

## Architecture

### Backend (FastAPI)
```
/app/backend/
├── server.py              # Main FastAPI app
├── routers/
│   ├── auth.py            # Authentication
│   ├── kyc.py             # KYC flows
│   ├── admin_users.py     # Admin user management
│   ├── notifications.py   # Badge system
│   ├── accounts.py        # Ledger operations (FIXED)
│   ├── transfers.py       # Banking transfers
│   ├── tickets.py         # Support system
│   └── cards.py           # Card requests
├── services/
│   └── kyc_service.py     # KYC business logic
└── utils/
    └── dependencies.py    # Auth & tax hold checks
```

### Frontend (React)
```
/app/frontend/src/
├── App.js                 # Main app with routing
├── components/
│   ├── AdminLayout.js     # Admin sidebar + badges
│   ├── AdminLedger.js     # Credit/Debit forms (FIXED)
│   ├── KYC.js             # Client KYC flow
│   ├── ProfessionalDashboard.js
│   └── Admin/             # Admin pages
└── styles/
    └── AdminLayout.css
```

### Database (MongoDB)
- Collections: users, kyc_applications, transfers, tickets, admin_section_views, tax_holds, bank_accounts, ledger_accounts, ledger_entries

## Key API Endpoints
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/kyc/submit` - Submit KYC
- `POST /api/v1/admin/kyc/{id}/review` - Review KYC
- `GET /api/v1/admin/notification-counts` - Badge counts
- `POST /api/v1/admin/notifications/seen` - Mark section seen
- `POST /api/v1/admin/accounts/{id}/topup` - Credit account (FIXED)
- `POST /api/v1/admin/accounts/{id}/withdraw` - Debit account (FIXED)
- `GET /api/v1/users/me/tax-status` - Client tax status

## Test Credentials
- **Admin:** admin@ecommbx.io / Admin@123456
- **Client:** ashleyalt005@gmail.com / 123456789

## Third-Party Integrations
- Resend (emails)
- Cloudinary (file storage)

## Deployment Notes
- Production URL: https://ecommbx.group
- Backend port: 8001
- Frontend port: 3000
- User needs to shut down old deployment first, then deploy from current task

## Known Issues
- None currently blocking

## Backlog / Future Tasks
- Mobile KYC ghost text issue (could not reproduce - needs user screenshots)
- Performance optimization for large user lists

## Latest Changes (Feb 24, 2026)
- Fixed Admin Credit/Debit blank white page bug
- Root cause: Frontend sent 'amount' but backend expected 'amount_cents'
- Added optional professional banking fields to API models
- Made description field optional with fallback
