"""Advanced banking features service."""

from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime, timedelta, date
from typing import List, Optional
from fastapi import HTTPException
import uuid

from schemas.advanced import ScheduledPayment, CreateScheduledPayment, Beneficiary, CreateBeneficiary, RecurringFrequency
from services.transfer_service import TransferService
from services.ledger_service import LedgerEngine
from utils.common import serialize_doc


class AdvancedBankingService:
    def __init__(self, db: AsyncIOMotorDatabase, ledger_engine: LedgerEngine):
        self.db = db
        self.ledger = ledger_engine
        self.transfer_service = TransferService(db, ledger_engine)
    
    # ==================== BENEFICIARIES ====================
    
    async def add_beneficiary(
        self,
        user_id: str,
        data: CreateBeneficiary
    ) -> Beneficiary:
        """Add a new beneficiary."""
        # Check if already exists
        existing = await self.db.beneficiaries.find_one({
            "user_id": user_id,
            "recipient_email": data.recipient_email.lower()
        })
        
        if existing:
            raise HTTPException(status_code=400, detail="Beneficiary already exists")
        
        beneficiary = Beneficiary(
            user_id=user_id,
            recipient_name=data.recipient_name,
            recipient_email=data.recipient_email.lower(),
            nickname=data.nickname
        )
        
        ben_dict = beneficiary.model_dump(by_alias=True)
        await self.db.beneficiaries.insert_one(ben_dict)
        
        return beneficiary
    
    async def get_beneficiaries(self, user_id: str) -> List[Beneficiary]:
        """Get all beneficiaries for a user."""
        cursor = self.db.beneficiaries.find({"user_id": user_id}).sort("last_used", -1)
        beneficiaries = []
        async for doc in cursor:
            beneficiaries.append(Beneficiary(**serialize_doc(doc)))
        return beneficiaries
    
    async def delete_beneficiary(self, beneficiary_id: str, user_id: str) -> bool:
        """Delete a beneficiary."""
        result = await self.db.beneficiaries.delete_one({
            "_id": beneficiary_id,
            "user_id": user_id
        })
        return result.deleted_count > 0
    
    # ==================== SCHEDULED PAYMENTS ====================
    
    async def create_scheduled_payment(
        self,
        user_id: str,
        data: CreateScheduledPayment
    ) -> ScheduledPayment:
        """Create a scheduled recurring payment."""
        # Parse date strings to datetime
        from datetime import datetime as dt
        start_dt = dt.fromisoformat(data.start_date) if isinstance(data.start_date, str) else datetime.combine(data.start_date, datetime.min.time())
        end_dt = dt.fromisoformat(data.end_date) if data.end_date and isinstance(data.end_date, str) else None
        
        # Calculate next execution
        next_exec = self._calculate_next_execution(start_dt.date(), data.frequency)
        
        scheduled = ScheduledPayment(
            user_id=user_id,
            recipient_email=data.recipient_email,
            amount=data.amount,
            reason=data.reason,
            frequency=data.frequency,
            start_date=start_dt,
            end_date=end_dt,
            next_execution=next_exec
        )
        
        sched_dict = scheduled.model_dump(by_alias=True)
        await self.db.scheduled_payments.insert_one(sched_dict)
        
        return scheduled
    
    async def get_scheduled_payments(self, user_id: str) -> List[ScheduledPayment]:
        """Get all scheduled payments for a user."""
        cursor = self.db.scheduled_payments.find({"user_id": user_id}).sort("created_at", -1)
        payments = []
        async for doc in cursor:
            payments.append(ScheduledPayment(**serialize_doc(doc)))
        return payments
    
    async def cancel_scheduled_payment(self, payment_id: str, user_id: str) -> bool:
        """Cancel a scheduled payment."""
        result = await self.db.scheduled_payments.update_one(
            {"_id": payment_id, "user_id": user_id},
            {"$set": {"active": False}}
        )
        return result.modified_count > 0
    
    def _calculate_next_execution(self, start: date, frequency: RecurringFrequency) -> datetime:
        """Calculate next execution datetime."""
        start_dt = datetime.combine(start, datetime.min.time())
        
        if frequency == RecurringFrequency.DAILY:
            return start_dt + timedelta(days=1)
        elif frequency == RecurringFrequency.WEEKLY:
            return start_dt + timedelta(weeks=1)
        elif frequency == RecurringFrequency.MONTHLY:
            return start_dt + timedelta(days=30)
        elif frequency == RecurringFrequency.YEARLY:
            return start_dt + timedelta(days=365)
        
        return start_dt
    
    # ==================== SPENDING INSIGHTS ====================
    
    async def get_spending_by_category(self, user_id: str, days: int = 30):
        """Get spending breakdown by category."""
        # Get user's accounts
        accounts = []
        async for acc in self.db.bank_accounts.find({"user_id": user_id}):
            accounts.append(acc)
        
        if not accounts:
            return {}
        
        # Get transactions from last N days
        from_date = datetime.utcnow() - timedelta(days=days)
        
        # For now, return mock data (real implementation would analyze transaction metadata)
        # In production, you'd store category in transaction metadata
        return {
            "FOOD_DINING": 25000,  # €250
            "TRANSPORT": 15000,     # €150
            "SHOPPING": 35000,      # €350
            "BILLS_UTILITIES": 20000, # €200
            "OTHER": 5000           # €50
        }
