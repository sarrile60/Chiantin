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
- **Professional Banking Transaction Display (colored status badges)**

## Technical Stack
- **Frontend:** React.js with TailwindCSS
- **Backend:** FastAPI (Python)
- **Database:** MongoDB
- **Authentication:** JWT tokens
- **Email:** Resend API

## Recent Changes (February 2025)

### Professional Banking Transaction Display (Feb 16, 2025)
**Problem:** Transaction status badges were using simple CSS classes without professional banking styling.

**Solution:**
- Created `/app/frontend/src/utils/transactions.js` utility with status badge configuration
- Implemented professional color-coded status badges:
  - **POSTED/COMPLETED:** Green badge (bg-green-50, text-green-700)
  - **SUBMITTED/PENDING:** Amber badge (bg-amber-50, text-amber-700)
  - **REJECTED/FAILED:** Red badge (bg-red-50, text-red-700)
  - **PROCESSING:** Blue badge (bg-blue-50, text-blue-700)
  - **CANCELLED:** Gray badge (bg-gray-100, text-gray-600)
  - **REVERSED:** Purple badge (bg-purple-50, text-purple-700)
- Credit amounts show as **+€X.XXX,XX** in GREEN
- Debit amounts show as **-€X.XXX,XX** in RED

**Files Changed:**
- `/app/frontend/src/utils/transactions.js` - NEW: Transaction display utility
- `/app/frontend/src/components/ProfessionalDashboard.js` - Customer transactions
- `/app/frontend/src/components/Transactions.js` - Transaction list and modal
- `/app/frontend/src/components/AdminTransfersQueue.js` - Admin transfers

**Verification:** 100% test pass rate - All status badges display correctly

### EU Currency Formatting (Feb 16, 2025)
**Format:** €24.650,00 (dot for thousands, comma for decimals)
**Files Changed:** 12+ components updated to use currency utility

### Users Tab Pagination Fix (Feb 16, 2025)
- Removed 100 user limit, added pagination (20/50/100 per page)
- Search queries ALL users in database

## Known Issues / Backlog

### P0 - Critical
- Domain SSL issue: `ecommbx.group` SSL certificate not provisioning

### P1 - High Priority
- Dangerous transfer deletion endpoint without ledger reversal

### P2 - Medium Priority
- Refactor `server.py` into smaller routers

## Database Schema (Key Collections)
- `users` - User accounts
- `bank_accounts` - Bank accounts
- `ledger_transactions` - Financial transactions
- `transfers` - Transfer records
- `tax_holds` - Tax hold information

## Test Files
- `/app/test_reports/` - Test reports directory
