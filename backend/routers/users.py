"""
Users Router - Customer-facing user endpoints.

Handles customer user operations including:
- Tax hold status check

Routes: /api/v1/users/*

IMPORTANT: This is a live banking application. Any changes must preserve
100% behavior parity with the original implementation.
"""

from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timezone

from database import get_database
from .dependencies import get_current_user, format_timestamp_utc

router = APIRouter(prefix="/api/v1/users", tags=["users"])


@router.get("/me/tax-status")
async def get_my_tax_status(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """Get current user's tax hold status."""
    user_id = current_user["id"]
    
    # Check for active tax hold
    tax_hold = await db.tax_holds.find_one({
        "user_id": user_id,
        "is_active": True
    })
    
    if not tax_hold:
        return {
            "is_blocked": False,
            "tax_amount_due": 0,
            "reason": None,
            "blocked_at": None,
            "payment_details": {}
        }
    
    return {
        "is_blocked": True,
        "tax_amount_due": (tax_hold.get("tax_amount_cents", 0) or 0) / 100,
        "reason": tax_hold.get("reason"),
        "blocked_at": format_timestamp_utc(tax_hold.get("blocked_at")),
        "payment_details": tax_hold.get("payment_details", {})
    }
