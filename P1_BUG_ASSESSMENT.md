# P1 Bug Assessment: auth_service.get_user() ObjectId Handling

**Assessment Date:** December 2025  
**Status:** ASSESSED - NOT FIXED (per user request)  
**Severity:** MEDIUM  

---

## 1. Root Cause Confirmed

**Location:** `/app/backend/services/auth_service.py` lines 173-178

```python
async def get_user(self, user_id: str) -> Optional[User]:
    user_doc = await self.db.users.find_one({"_id": user_id})  # BUG: string ID, but MongoDB uses ObjectId
    if not user_doc:
        return None
    return User(**serialize_doc(user_doc))
```

**Problem:** MongoDB stores user `_id` as `ObjectId`, but this method passes the ID as a string without conversion. Since `ObjectId("abc123") != "abc123"`, the query always returns `None`.

---

## 2. Affected Endpoints

| Endpoint | Effect | Severity |
|----------|--------|----------|
| `GET /api/v1/auth/me` | Returns 404 "User not found" | MEDIUM |
| `POST /api/v1/auth/mfa/setup` | Returns 404 "User not found" | MEDIUM |
| `POST /api/v1/auth/mfa/enable` | Returns "MFA not set up" | MEDIUM |
| Ticket operations | May fail to get user info | LOW |

**Note:** Core auth flows (login, logout, signup) are NOT affected because they use `authenticate_user()` which queries by email, not ID.

---

## 3. Impact Scope

- **User Impact:** Users cannot view their profile (`/auth/me`) or set up MFA
- **Admin Impact:** None - admin flows use different code paths
- **Security Impact:** LOW - does not create security vulnerabilities
- **Data Impact:** None - no data corruption

---

## 4. Recommended Fix

**Minimal safe fix (matches pattern used elsewhere):**

```python
async def get_user(self, user_id: str) -> Optional[User]:
    from bson import ObjectId
    from bson.errors import InvalidId
    
    # Try as string first
    user_doc = await self.db.users.find_one({"_id": user_id})
    
    # If not found, try as ObjectId
    if not user_doc:
        try:
            user_doc = await self.db.users.find_one({"_id": ObjectId(user_id)})
        except InvalidId:
            pass
    
    if not user_doc:
        return None
    return User(**serialize_doc(user_doc))
```

---

## 5. Regression Tests Needed

1. `GET /auth/me` with valid token → should return user data
2. `POST /auth/mfa/setup` → should return secret and QR code URI
3. `POST /auth/mfa/enable` → should enable MFA with valid token
4. Ticket creation/update → should include user info

---

## 6. Rollback Plan

If fix causes issues:
1. `git revert <fix-commit>`
2. `sudo supervisorctl restart backend`
3. Verify login/logout still works

---

## 7. Why NOT Fixed in This Session

Per user request:
- Keep P1 bug fix separate from P0 router extraction
- Do not mix bug fixes into refactor commits
- Maintain clean rollback capability

**Recommended:** Fix as dedicated commit in separate session after P0 extraction is stable.

---

## 8. Call Sites Audit

```bash
$ grep -rn "auth_service.get_user" /app/backend --include="*.py"
```

| File | Line | Usage |
|------|------|-------|
| `routers/auth.py` | 53 | `/auth/me` endpoint |
| `routers/auth.py` | (indirect) | MFA setup via AuthService |
| `routers/tickets.py` | Multiple | Getting user info for tickets |

---

**END OF ASSESSMENT**
