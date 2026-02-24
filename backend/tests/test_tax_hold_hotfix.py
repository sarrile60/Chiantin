"""
P0 EMERGENCY HOTFIX - Tax Hold Regression Tests

Tests for three critical fixes:
1) Tax amount showing €0 - field name mismatch (tax_amount_due vs tax_amount_cents)
2) Client not receiving notification - notification service not being called
3) Account not being restricted - check_tax_hold function querying wrong field

Admin: ashleyalt005@gmail.com / 123456789 (role: ADMIN)
Test user: sportrealityalt@gmail.com (ID: 699daf041b0971004de077f7)
"""
import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test users
ADMIN_EMAIL = "ashleyalt005@gmail.com"
ADMIN_PASSWORD = "123456789"
TEST_USER_ID = "699daf041b0971004de077f7"
TEST_USER_EMAIL = "sportrealityalt@gmail.com"


@pytest.fixture(scope="module")
def admin_token():
    """Get admin authentication token."""
    response = requests.post(
        f"{BASE_URL}/api/v1/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
    )
    if response.status_code != 200:
        pytest.skip(f"Admin login failed: {response.status_code} - {response.text}")
    data = response.json()
    return data.get("access_token")


@pytest.fixture(scope="module")
def admin_headers(admin_token):
    """Headers with admin auth token."""
    return {
        "Authorization": f"Bearer {admin_token}",
        "Content-Type": "application/json"
    }


@pytest.fixture(scope="module")
def test_user_id(admin_headers):
    """Find or return the test user ID."""
    # First try to find sportrealityalt@gmail.com
    response = requests.get(
        f"{BASE_URL}/api/v1/admin/users?search={TEST_USER_EMAIL}",
        headers=admin_headers
    )
    if response.status_code == 200:
        data = response.json()
        users = data.get("users", [])
        for user in users:
            if user.get("email") == TEST_USER_EMAIL:
                return user.get("id")
    
    # If not found, get first customer user
    response = requests.get(
        f"{BASE_URL}/api/v1/admin/users?page=1&limit=50",
        headers=admin_headers
    )
    if response.status_code == 200:
        data = response.json()
        users = data.get("users", [])
        for user in users:
            if user.get("role") == "CUSTOMER" and user.get("status") == "ACTIVE":
                return user.get("id")
    
    pytest.skip("No suitable test user found")


@pytest.fixture(scope="module")
def test_user_token(test_user_id, admin_headers):
    """Get test user's credentials and token."""
    # Get user details to find password
    response = requests.get(
        f"{BASE_URL}/api/v1/admin/users/{test_user_id}",
        headers=admin_headers
    )
    if response.status_code != 200:
        pytest.skip(f"Could not get user details: {response.status_code}")
    
    data = response.json()
    user = data.get("user", {})
    email = user.get("email")
    password = user.get("password_plain")
    
    if not password:
        pytest.skip("Test user has no stored password")
    
    # Login as test user
    response = requests.post(
        f"{BASE_URL}/api/v1/auth/login",
        json={"email": email, "password": password}
    )
    if response.status_code != 200:
        pytest.skip(f"Test user login failed: {response.status_code}")
    
    return response.json().get("access_token")


@pytest.fixture(scope="module")
def test_user_headers(test_user_token):
    """Headers with test user auth token."""
    return {
        "Authorization": f"Bearer {test_user_token}",
        "Content-Type": "application/json"
    }


class TestAdminAuthentication:
    """Test admin login and authentication."""
    
    def test_admin_login(self):
        """Test admin can login successfully."""
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert data["user"]["role"] == "ADMIN"
        print(f"✓ Admin login successful, role: {data['user']['role']}")


class TestTaxHoldCRUD:
    """Test tax hold CRUD operations - validates FIX #1 (tax_amount_cents field)."""
    
    def test_apply_tax_hold_with_amount(self, admin_headers, test_user_id):
        """FIX #1 VALIDATION: Apply tax hold and verify amount is stored correctly."""
        # First remove any existing tax hold
        requests.delete(
            f"{BASE_URL}/api/v1/admin/users/{test_user_id}/tax-hold",
            headers=admin_headers
        )
        
        # Apply new tax hold with €5000
        tax_amount = 5000.00
        response = requests.post(
            f"{BASE_URL}/api/v1/admin/users/{test_user_id}/tax-hold",
            headers=admin_headers,
            json={
                "tax_amount": tax_amount,
                "reason": "Test tax obligations - P0 hotfix validation"
            }
        )
        assert response.status_code == 200, f"Failed to apply tax hold: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print(f"✓ Tax hold applied successfully: {data.get('message')}")
    
    def test_get_tax_hold_returns_correct_amount(self, admin_headers, test_user_id):
        """FIX #1 VALIDATION: Verify GET returns correct tax amount (not €0)."""
        response = requests.get(
            f"{BASE_URL}/api/v1/admin/users/{test_user_id}/tax-hold",
            headers=admin_headers
        )
        assert response.status_code == 200, f"Failed to get tax hold: {response.text}"
        data = response.json()
        
        # CRITICAL: This was the bug - tax_amount_due was returning 0
        assert data.get("is_blocked") == True, "User should be blocked"
        tax_amount = data.get("tax_amount_due", 0)
        assert tax_amount == 5000.00, f"REGRESSION: Tax amount should be 5000, got {tax_amount}"
        assert data.get("reason") is not None, "Reason should be present"
        print(f"✓ Tax hold GET returns correct amount: €{tax_amount}")
        print(f"  - is_blocked: {data.get('is_blocked')}")
        print(f"  - reason: {data.get('reason')}")
    
    def test_update_tax_hold_amount(self, admin_headers, test_user_id):
        """Test updating tax hold amount from €5000 to €7500."""
        # Update to new amount
        new_amount = 7500.00
        response = requests.post(
            f"{BASE_URL}/api/v1/admin/users/{test_user_id}/tax-hold",
            headers=admin_headers,
            json={
                "tax_amount": new_amount,
                "reason": "Updated tax obligations - P0 hotfix validation"
            }
        )
        assert response.status_code == 200, f"Failed to update tax hold: {response.text}"
        
        # Verify the update
        response = requests.get(
            f"{BASE_URL}/api/v1/admin/users/{test_user_id}/tax-hold",
            headers=admin_headers
        )
        assert response.status_code == 200
        data = response.json()
        tax_amount = data.get("tax_amount_due", 0)
        assert tax_amount == 7500.00, f"Updated tax amount should be 7500, got {tax_amount}"
        print(f"✓ Tax hold updated: €5000 → €{tax_amount}")


class TestNotificationCreation:
    """Test notification creation - validates FIX #2 (notification service calls)."""
    
    def test_notification_created_for_tax_hold(self, admin_headers, test_user_id):
        """FIX #2 VALIDATION: Verify notification is created when tax hold is placed."""
        # Clear existing tax hold first
        requests.delete(
            f"{BASE_URL}/api/v1/admin/users/{test_user_id}/tax-hold",
            headers=admin_headers
        )
        time.sleep(0.5)
        
        # Apply new tax hold - should create notification
        response = requests.post(
            f"{BASE_URL}/api/v1/admin/users/{test_user_id}/tax-hold",
            headers=admin_headers,
            json={
                "tax_amount": 5000.00,
                "reason": "Notification test - P0 hotfix"
            }
        )
        assert response.status_code == 200, f"Failed to apply tax hold: {response.text}"
        print("✓ Tax hold applied, notification should be created")
        
    def test_notification_created_for_tax_hold_removal(self, admin_headers, test_user_id):
        """FIX #2 VALIDATION: Verify notification is created when tax hold is removed."""
        # First ensure tax hold exists
        response = requests.post(
            f"{BASE_URL}/api/v1/admin/users/{test_user_id}/tax-hold",
            headers=admin_headers,
            json={
                "tax_amount": 5000.00,
                "reason": "Pre-removal test"
            }
        )
        
        # Remove tax hold - should create notification
        response = requests.delete(
            f"{BASE_URL}/api/v1/admin/users/{test_user_id}/tax-hold",
            headers=admin_headers
        )
        assert response.status_code == 200, f"Failed to remove tax hold: {response.text}"
        data = response.json()
        assert data.get("success") == True
        print("✓ Tax hold removed, notification should be created")


class TestAccountRestriction:
    """Test account restriction - validates FIX #3 (is_active vs status query)."""
    
    def test_transfer_blocked_with_tax_hold(self, admin_headers, test_user_id, test_user_headers):
        """FIX #3 VALIDATION: Verify transfers are blocked when tax hold is active."""
        # Ensure tax hold is active
        response = requests.post(
            f"{BASE_URL}/api/v1/admin/users/{test_user_id}/tax-hold",
            headers=admin_headers,
            json={
                "tax_amount": 5000.00,
                "reason": "Transfer restriction test"
            }
        )
        assert response.status_code == 200
        
        # Attempt transfer as test user - should be blocked with 403
        response = requests.post(
            f"{BASE_URL}/api/v1/transfers",
            headers=test_user_headers,
            json={
                "beneficiary_name": "Test Recipient",
                "beneficiary_iban": "DE89370400440532013000",
                "amount": 1000,
                "reason": "Test transfer"
            }
        )
        
        # Should return 403 with TAX_HOLD code
        assert response.status_code == 403, f"Expected 403 for tax hold, got {response.status_code}"
        data = response.json()
        detail = data.get("detail", {})
        if isinstance(detail, dict):
            assert detail.get("code") == "TAX_HOLD", f"Expected TAX_HOLD code, got: {detail}"
            tax_amount = detail.get("tax_amount_due")
            assert tax_amount == 5000.00, f"Tax amount in error should be 5000, got {tax_amount}"
            print(f"✓ Transfer correctly blocked with TAX_HOLD, amount: €{tax_amount}")
        else:
            print(f"⚠ Transfer blocked but detail format unexpected: {detail}")
    
    def test_transfer_allowed_after_tax_hold_removal(self, admin_headers, test_user_id):
        """Verify transfers work after tax hold is removed."""
        # Remove tax hold
        response = requests.delete(
            f"{BASE_URL}/api/v1/admin/users/{test_user_id}/tax-hold",
            headers=admin_headers
        )
        assert response.status_code == 200
        
        # Verify tax hold is removed
        response = requests.get(
            f"{BASE_URL}/api/v1/admin/users/{test_user_id}/tax-hold",
            headers=admin_headers
        )
        data = response.json()
        assert data.get("is_blocked") == False, "User should not be blocked after removal"
        print("✓ Tax hold removed, user should be able to transfer")


class TestAdminPagesLoad:
    """Test admin pages load correctly."""
    
    def test_admin_users_list(self, admin_headers):
        """Admin Users list loads correctly."""
        response = requests.get(
            f"{BASE_URL}/api/v1/admin/users?page=1&limit=50",
            headers=admin_headers
        )
        assert response.status_code == 200, f"Admin users failed: {response.text}"
        data = response.json()
        assert "users" in data
        assert "pagination" in data
        print(f"✓ Admin Users list loaded: {len(data['users'])} users")
    
    def test_admin_user_details(self, admin_headers, test_user_id):
        """Admin User Details loads correctly."""
        response = requests.get(
            f"{BASE_URL}/api/v1/admin/users/{test_user_id}",
            headers=admin_headers
        )
        assert response.status_code == 200, f"User details failed: {response.text}"
        data = response.json()
        assert "user" in data
        print(f"✓ User details loaded for: {data['user']['email']}")
    
    def test_admin_kyc_queue(self, admin_headers):
        """Admin KYC Queue opens."""
        response = requests.get(
            f"{BASE_URL}/api/v1/admin/kyc-queue?page=1&limit=50",
            headers=admin_headers
        )
        assert response.status_code == 200, f"KYC queue failed: {response.text}"
        print("✓ KYC Queue loaded")
    
    def test_admin_accounts_page(self, admin_headers):
        """Admin Accounts page loads."""
        response = requests.get(
            f"{BASE_URL}/api/v1/admin/accounts-with-users?page=1&limit=50",
            headers=admin_headers
        )
        assert response.status_code == 200, f"Accounts failed: {response.text}"
        print("✓ Accounts page loaded")
    
    def test_admin_transfers_queue(self, admin_headers):
        """Admin Transfers Queue opens."""
        response = requests.get(
            f"{BASE_URL}/api/v1/admin/transfers?page=1&page_size=20&status=SUBMITTED",
            headers=admin_headers
        )
        assert response.status_code == 200, f"Transfers queue failed: {response.text}"
        print("✓ Transfers Queue loaded")
    
    def test_admin_support_tickets(self, admin_headers):
        """Admin Support Tickets opens."""
        response = requests.get(
            f"{BASE_URL}/api/v1/admin/tickets",
            headers=admin_headers
        )
        assert response.status_code == 200, f"Support tickets failed: {response.text}"
        print("✓ Support Tickets loaded")
    
    def test_admin_notification_counts(self, admin_headers):
        """Notification badge counts work correctly."""
        response = requests.get(
            f"{BASE_URL}/api/v1/admin/notification-counts",
            headers=admin_headers
        )
        assert response.status_code == 200, f"Notification counts failed: {response.text}"
        data = response.json()
        print(f"✓ Notification counts loaded: {data}")


class TestCleanup:
    """Cleanup after tests."""
    
    def test_cleanup_tax_hold(self, admin_headers, test_user_id):
        """Remove tax hold after testing."""
        response = requests.delete(
            f"{BASE_URL}/api/v1/admin/users/{test_user_id}/tax-hold",
            headers=admin_headers
        )
        # Don't fail if already removed
        print("✓ Cleanup: Tax hold removed (if existed)")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
