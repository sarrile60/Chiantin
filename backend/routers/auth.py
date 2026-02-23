"""
Auth Router - Authentication endpoints.

Handles all authentication operations including:
- User signup/registration
- Login/logout
- Email verification
- Password management
- MFA setup/enable

Routes: /api/v1/auth/*

IMPORTANT: This is a live banking application. Any changes must preserve
100% behavior parity with the original implementation.
"""

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import Optional
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel
import logging
import uuid

from database import get_database
from config import settings
from services.auth_service import AuthService
from services.email_service import EmailService
from core.auth import hash_password, verify_password
from schemas.users import (
    UserCreate, UserLogin, TokenResponse, UserResponse, 
    MFASetupResponse, MFAVerifyRequest, ResendVerificationRequest, VerifyEmailRequest,
    SignupRequest, PasswordChangeRequest, VerifyPasswordRequest,
    ForgotPasswordRequest, ResetPasswordRequest
)

from .dependencies import get_current_user, require_admin, create_audit_log

logger = logging.getLogger(__name__)

# Router definition - NO prefix here, we'll add it when including
router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


# ==================== /auth/me ====================

@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get current user info."""
    auth_service = AuthService(db)
    user = await auth_service.get_user(current_user["id"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        role=user.role,
        status=user.status,
        email_verified=user.email_verified,
        mfa_enabled=user.mfa_enabled,
        created_at=user.created_at,
        last_login_at=user.last_login_at
    )


# NOTE: More endpoints will be moved here incrementally in subsequent phases
