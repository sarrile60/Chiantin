# Production Monitoring Plan - Backend Router Extraction

## Overview
This document provides monitoring guidelines for the backend router extraction refactor:
- **tickets.py**: Support ticket routes
- **kyc.py**: KYC routes  
- **admin_users.py**: Admin user management routes
- **health.py**: Health check routes
- **audit.py**: Audit log routes

## A) Error Monitoring (First 24-72 Hours)

### API 5xx Rate Monitoring
| Endpoint Group | Expected Rate | Alert Threshold |
|----------------|---------------|-----------------|
| `/api/v1/admin/users/*` | <0.1% | >1% |
| `/api/v1/admin/tickets/*` | <0.1% | >1% |
| `/api/v1/tickets/*` | <0.1% | >1% |
| `/api/v1/kyc/*` | <0.1% | >1% |
| `/api/v1/admin/kyc/*` | <0.1% | >1% |
| `/api/health` | 0% | >0.1% |

### 4xx Rate Monitoring
- Watch for unexpected 404s on extracted routes
- Monitor auth failures (401/403) - should match pre-refactor rates

### Key Metrics to Track
```
# Backend logs to monitor
tail -f /var/log/supervisor/backend.err.log | grep -E "ERROR|CRITICAL|Exception"

# Check for import errors
grep -i "ImportError\|ModuleNotFound" /var/log/supervisor/backend.err.log

# Check for startup issues
grep -i "APPLICATION STARTUP" /var/log/supervisor/backend.err.log
```

## B) Admin UI Behavior Monitoring

### Critical Paths to Verify
1. **Users Page**
   - [ ] List loads with pagination
   - [ ] Search by name/email/phone works
   - [ ] User details panel opens
   - [ ] Tax hold status displays
   - [ ] Admin notes save correctly
   - [ ] Copy email/phone buttons work

2. **KYC Queue**
   - [ ] Pending applications load
   - [ ] Approve/reject actions work
   - [ ] Document viewing works

3. **Support Tickets**
   - [ ] Ticket list loads
   - [ ] Creating tickets works
   - [ ] Adding messages works
   - [ ] File attachments work

4. **Audit Logs**
   - [ ] Log entries display
   - [ ] Timestamps are correct (UTC)

### Frontend Console Errors
```javascript
// Watch for in browser console:
- "Failed to fetch"
- "NetworkError"
- "404 Not Found"
- "500 Internal Server Error"
```

## C) Performance Monitoring

### Baseline Metrics (Pre-Refactor)
| Endpoint | p50 | p95 |
|----------|-----|-----|
| GET /api/v1/admin/users | ~200ms | ~500ms |
| GET /api/v1/admin/users/{id} | ~100ms | ~300ms |
| GET /api/v1/admin/tickets | ~150ms | ~400ms |
| GET /api/v1/kyc/application | ~50ms | ~150ms |

### Post-Refactor Comparison
- Monitor for >50% latency increase
- Watch for duplicate API calls in network tab
- Check for N+1 query patterns

### Performance Checks
```bash
# API response time check
time curl -s -H "Authorization: Bearer $TOKEN" "$API_URL/api/v1/admin/users?limit=50"

# Health check
curl -w "%{time_total}s" -o /dev/null -s "$API_URL/api/health"
```

## D) Operational Checklist

### Rollback Triggers
1. **Critical - Immediate Rollback:**
   - Sustained 5xx rate >5% for 5+ minutes
   - Login/auth failures >10%
   - Backend startup failures
   - Data corruption detected

2. **Warning - Monitor Closely:**
   - 5xx rate >1% for 10+ minutes
   - Latency increase >100%
   - User-reported issues in specific flows

### Rollback Steps (Per Router)

#### Revert admin_users.py
```bash
# Option 1: Selective revert
git revert <admin_users_extraction_commit>
sudo supervisorctl restart backend

# Option 2: Full rollback to pre-refactor
git checkout <pre_refactor_commit> -- /app/backend/server.py
rm /app/backend/routers/admin_users.py
# Update server.py to remove router import
sudo supervisorctl restart backend
```

#### Revert tickets.py
```bash
git revert <tickets_extraction_commit>
sudo supervisorctl restart backend
```

#### Revert kyc.py
```bash
git revert <kyc_extraction_commit>
sudo supervisorctl restart backend
```

### Post-Rollback Verification
```bash
# Check backend started
sudo supervisorctl status backend

# Check health
curl "$API_URL/api/health"

# Run smoke tests
curl -H "Authorization: Bearer $TOKEN" "$API_URL/api/v1/admin/users?limit=3"
curl -H "Authorization: Bearer $TOKEN" "$API_URL/api/v1/admin/tickets"
curl -H "Authorization: Bearer $TOKEN" "$API_URL/api/v1/kyc/application"
```

## E) Validation Ownership

| Area | Owner | Frequency |
|------|-------|-----------|
| API health checks | On-call | Every 5 min (automated) |
| Admin UI smoke test | QA | Every deploy |
| Performance baseline | DevOps | Weekly |
| Log review | Dev team | Daily (first week) |

## F) Not Implemented (Deferred)

### Auth Router Extraction
- **Status:** DEFERRED
- **Reason:** High risk, requires careful planning
- **Current:** Auth routes remain in server.py

### Transfer Restore Feature (P1)
- **Status:** NOT IMPLEMENTED
- **Reason:** Explicitly excluded from scope
- **Current:** No changes to transfer soft-delete behavior

---

*Document created: Feb 23, 2025*
*Last updated: Feb 23, 2025*
*Author: E1 Agent*
