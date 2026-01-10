"""Email service for notifications and OTP."""

import secrets
import string
from datetime import datetime, timedelta
from typing import Optional


class EmailService:
    """Mock email service - in production, use SendGrid/AWS SES."""
    
    def __init__(self):
        self.sent_emails = []  # Store for testing
    
    def send_password_reset(self, to_email: str, reset_token: str, temp_password: Optional[str] = None):
        """Send password reset email."""
        subject = "Password Reset - Project Atlas"
        
        if temp_password:
            body = f"""
            Your password has been reset by an administrator.
            
            Temporary Password: {temp_password}
            
            Please login and change your password immediately.
            """
        else:
            body = f"""
            Click the link below to reset your password:
            
            Reset Token: {reset_token}
            
            This link expires in 1 hour.
            """
        
        # Mock sending
        email = {
            'to': to_email,
            'subject': subject,
            'body': body,
            'sent_at': datetime.utcnow()
        }
        self.sent_emails.append(email)
        
        print(f"[MOCK EMAIL] To: {to_email}")
        print(f"[MOCK EMAIL] Subject: {subject}")
        print(f"[MOCK EMAIL] Body: {body.strip()}")
        
        return True
    
    def send_otp(self, to_email: str, otp_code: str):
        """Send OTP code via email."""
        subject = "Your Login Code - Project Atlas"
        body = f"""
        Your verification code is: {otp_code}
        
        This code expires in 10 minutes.
        
        If you didn't request this code, please ignore this email.
        """
        
        email = {
            'to': to_email,
            'subject': subject,
            'body': body,
            'sent_at': datetime.utcnow()
        }
        self.sent_emails.append(email)
        
        print(f"[MOCK EMAIL] To: {to_email}")
        print(f"[MOCK EMAIL] OTP Code: {otp_code}")
        
        return True
    
    @staticmethod
    def generate_temp_password(length: int = 12) -> str:
        """Generate a secure temporary password."""
        characters = string.ascii_letters + string.digits + "!@#$%"
        password = ''.join(secrets.choice(characters) for _ in range(length))
        # Ensure at least one of each type
        if not any(c.isupper() for c in password):
            password = password[:-1] + secrets.choice(string.ascii_uppercase)
        if not any(c.isdigit() for c in password):
            password = password[:-1] + secrets.choice(string.digits)
        return password
    
    @staticmethod
    def generate_otp() -> str:
        """Generate 6-digit OTP."""
        return ''.join(secrets.choice(string.digits) for _ in range(6))
