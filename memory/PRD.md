# ecommbx Banking Platform - Product Requirements Document

## Overview
ecommbx is a full-stack EU-licensed digital banking platform built with React frontend, FastAPI backend, and MongoDB database.

## Core Features
- User authentication (JWT)
- Bank accounts with ledger-based balance tracking
- P2P transfers
- Admin panel for user management
- KYC management
- Tax hold management
- Multi-language support (English, Italian)
- Balance visibility toggle
- **EU Currency Formatting (dot for thousands, comma for decimals)**

## Technical Stack
- **Frontend:** React.js with TailwindCSS
- **Backend:** FastAPI (Python)
- **Database:** MongoDB
- **Authentication:** JWT tokens
- **Email:** Resend API

## Recent Changes (February 2025)

### EU Currency Formatting (Feb 16, 2025)
**Problem:** Currency was displayed in US/UK format (€24,650.00) instead of EU format.

**Solution:**
- Created `/app/frontend/src/utils/currency.js` utility with EU formatting functions
- Uses `toLocaleString('de-DE')` for proper EU number formatting
- Updated all components to use the new formatting utility
- Format: **€24.650,00** (dot for thousands, comma for decimals)

**Files Changed:**
- `/app/frontend/src/utils/currency.js` - NEW: Currency formatting utility
- `/app/frontend/src/hooks/useBalanceVisibility.js` - Updated formatBalance for EU format
- `/app/frontend/src/App.js` - Updated formatAmount and currency displays
- `/app/frontend/src/components/ProfessionalDashboard.js` - Updated currency displays
- `/app/frontend/src/components/P2PTransfer.js` - Updated transfer amounts
- `/app/frontend/src/components/SpendingInsights.js` - Updated chart tooltips
- `/app/frontend/src/components/AdminTransfersQueue.js` - Updated amount displays
- `/app/frontend/src/components/AdminLedger.js` - Updated credit/debit amounts
- `/app/frontend/src/components/AdminSettings.js` - Updated max amounts
- `/app/frontend/src/components/ScheduledPayments.js` - Updated payment amounts
- `/app/frontend/src/components/CardOrderingModal.js` - Updated account balances
- `/app/frontend/src/components/NewTransferModal.js` - Updated amount displays

**Verification:** 100% test pass rate - All amounts display in EU format

### Users Tab Pagination Fix (Feb 16, 2025)
**Problem:** Some clients (like Josep, user #104) didn't appear in Users tab due to 100 user limit.

**Solution:**
- Removed 100 user limit from `/api/v1/admin/users`
- Added pagination (20, 50, 100 per page, default 50)
- Search queries ALL users in database

**Verification:** 100% test pass rate - Josep now appears when searching

## Known Issues / Backlog

### P0 - Critical
- Domain SSL issue: `ecommbx.group` SSL certificate not provisioning (requires Emergent support)

### P1 - High Priority
- **Dangerous transfer deletion endpoint** (`/api/v1/admin/transfers/{transfer_id}/delete`) performs hard delete without reversing ledger transaction

### P2 - Medium Priority
- Refactor `server.py` into smaller FastAPI routers

## Database Schema (Key Collections)
- `users` - User accounts with roles, status, preferences
- `bank_accounts` - Bank accounts linked to users
- `ledger_accounts` - Ledger accounts for balance tracking
- `ledger_transactions` - All financial transactions
- `kyc_applications` - KYC application records
- `transfers` - Transfer records
- `tax_holds` - Tax hold information
- `notifications` - User notifications

## API Endpoints (Key)
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/admin/users` - List users with pagination and search
- `GET /api/v1/admin/users/{user_id}` - User details
- `GET /api/v1/admin/accounts-with-users` - Accounts list

## Test Files
- `/app/backend/tests/test_users_pagination.py` - Pagination tests
- `/app/test_reports/` - Test reports directory
