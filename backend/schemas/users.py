"""User models and schemas."""

from pydantic import BaseModel, EmailStr, Field, field_validator
from pydantic_core import PydanticCustomError
from datetime import datetime
from typing import Optional, List, Annotated
from enum import Enum
from bson import ObjectId
import re


class UserRole(str, Enum):
    CUSTOMER = "CUSTOMER"
    SUPPORT_AGENT = "SUPPORT_AGENT"
    COMPLIANCE_OFFICER = "COMPLIANCE_OFFICER"
    FINANCE_OPS = "FINANCE_OPS"
    ADMIN = "ADMIN"
    SUPER_ADMIN = "SUPER_ADMIN"


class UserStatus(str, Enum):
    ACTIVE = "ACTIVE"
    DISABLED = "DISABLED"
    PENDING = "PENDING"


class User(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    email: str
    phone: Optional[str] = None
    password_hash: str
    
    first_name: str
    last_name: str
    
    role: UserRole = UserRole.CUSTOMER
    status: UserStatus = UserStatus.PENDING
    
    email_verified: bool = False
    phone_verified: bool = False
    
    mfa_enabled: bool = False
    mfa_secret: Optional[str] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login_at: Optional[datetime] = None
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        # Allow .local domains for development/demo
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.local$'
        if not re.match(email_pattern, v):
            raise ValueError('Invalid email address')
        return v.lower()
    
    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}


class UserCreate(BaseModel):
    email: str
    password: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        # Allow .local domains for development/demo
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.local$'
        if not re.match(email_pattern, v):
            raise ValueError('Invalid email address')
        return v.lower()
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        return v


class UserLogin(BaseModel):
    email: str
    password: str
    totp_token: Optional[str] = None
    
    @field_validator('email')
    @classmethod
    def validate_email(cls, v):
        # Allow .local domains for development/demo
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.local$'
        if not re.match(email_pattern, v):
            raise ValueError('Invalid email address')
        return v.lower()


class UserResponse(BaseModel):
    id: str
    email: EmailStr
    first_name: str
    last_name: str
    role: UserRole
    status: UserStatus
    email_verified: bool
    mfa_enabled: bool
    created_at: datetime
    last_login_at: Optional[datetime] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class MFASetupResponse(BaseModel):
    secret: str
    qr_code_uri: str


class MFAVerifyRequest(BaseModel):
    token: str