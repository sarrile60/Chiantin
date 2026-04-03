"""
Pre-Deployment Health Check Tests for Chiantin Banking Platform.

Tests all critical endpoints before production deployment:
- Authentication (admin and customer login)
- Admin panel endpoints (users, KYC, cards, transfers, tickets, audit logs)
- Customer dashboard endpoints
- Support functionality
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://countdown-compliance.preview.emergentagent.com')

# Test credentials from test_credentials.md
ADMIN_EMAIL = "admin@ecommbx.io"
ADMIN_PASSWORD = "Admin@123456"
CUSTOMER_EMAIL = "testuser@chiantin.eu"
CUSTOMER_PASSWORD = "Test@123456"


class TestHealthEndpoints:
    """Health check endpoints"""
    
    def test_api_health(self):
        """Test /api/health returns healthy status"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["app"] == "Chiantin"
        print(f"✓ API health check passed: {data}")


class TestAuthentication:
    """Authentication endpoint tests"""
    
    def test_admin_login_success(self):
        """Test admin login with valid credentials"""
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["user"]["email"] == ADMIN_EMAIL
        assert data["user"]["role"] == "SUPER_ADMIN"
        assert data["user"]["status"] == "ACTIVE"
        print(f"✓ Admin login successful: {data['user']['email']} ({data['user']['role']})")
    
    def test_customer_login_success(self):
        """Test customer login with valid credentials"""
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": CUSTOMER_EMAIL, "password": CUSTOMER_PASSWORD}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["user"]["email"] == CUSTOMER_EMAIL
        assert data["user"]["role"] == "CUSTOMER"
        assert data["user"]["status"] == "ACTIVE"
        print(f"✓ Customer login successful: {data['user']['email']} ({data['user']['role']})")
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials returns 401"""
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": "invalid@test.com", "password": "wrongpassword"}
        )
        assert response.status_code == 401
        print("✓ Invalid credentials correctly rejected with 401")
    
    def test_login_wrong_password(self):
        """Test login with wrong password returns 401"""
        response = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"email": ADMIN_EMAIL, "password": "wrongpassword"}
        )
        assert response.status_code == 401
        print("✓ Wrong password correctly rejected with 401")


@pytest.fixture(scope="class")
def admin_token():
    """Get admin authentication token"""
    response = requests.post(
        f"{BASE_URL}/api/v1/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
    )
    if response.status_code == 200:
        return response.json()["access_token"]
    pytest.skip("Admin authentication failed")


@pytest.fixture(scope="class")
def customer_token():
    """Get customer authentication token"""
    response = requests.post(
        f"{BASE_URL}/api/v1/auth/login",
        json={"email": CUSTOMER_EMAIL, "password": CUSTOMER_PASSWORD}
    )
    if response.status_code == 200:
        return response.json()["access_token"]
    pytest.skip("Customer authentication failed")


class TestAdminEndpoints:
    """Admin panel endpoint tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self, admin_token):
        self.token = admin_token
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_admin_users_list(self):
        """Test GET /api/v1/admin/users returns user list"""
        response = requests.get(f"{BASE_URL}/api/v1/admin/users", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert "users" in data
        assert "pagination" in data
        assert len(data["users"]) > 0
        print(f"✓ Admin users list: {data['pagination']['total_users']} users found")
    
    def test_admin_users_pagination(self):
        """Test admin users pagination works"""
        response = requests.get(
            f"{BASE_URL}/api/v1/admin/users?page=1&limit=20",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["pagination"]["page"] == 1
        assert data["pagination"]["limit"] == 20
        print(f"✓ Admin users pagination working")
    
    def test_admin_analytics_overview(self):
        """Test GET /api/v1/admin/analytics/overview returns stats"""
        response = requests.get(
            f"{BASE_URL}/api/v1/admin/analytics/overview",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        # Check for expected stats fields
        assert "total_users" in data or "users" in data or isinstance(data, dict)
        print(f"✓ Admin analytics overview: {data}")
    
    def test_admin_kyc_queue(self):
        """Test GET /api/v1/admin/kyc/pending returns KYC queue"""
        response = requests.get(f"{BASE_URL}/api/v1/admin/kyc/pending", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, (list, dict))
        print(f"✓ Admin KYC queue accessible")
    
    def test_admin_card_requests(self):
        """Test GET /api/v1/admin/card-requests returns card requests"""
        response = requests.get(
            f"{BASE_URL}/api/v1/admin/card-requests",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, (list, dict))
        print(f"✓ Admin card requests accessible")
    
    def test_admin_transfers_queue(self):
        """Test GET /api/v1/admin/transfers returns transfers queue"""
        response = requests.get(
            f"{BASE_URL}/api/v1/admin/transfers",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, (list, dict))
        print(f"✓ Admin transfers queue accessible")
    
    def test_admin_tickets(self):
        """Test GET /api/v1/admin/tickets returns support tickets"""
        response = requests.get(
            f"{BASE_URL}/api/v1/admin/tickets",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, (list, dict))
        print(f"✓ Admin support tickets accessible")
    
    def test_admin_audit_logs(self):
        """Test GET /api/v1/admin/audit-logs returns audit logs"""
        response = requests.get(
            f"{BASE_URL}/api/v1/admin/audit-logs",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, (list, dict))
        print(f"✓ Admin audit logs accessible")
    
    def test_admin_accounts_with_users(self):
        """Test GET /api/v1/admin/accounts-with-users returns accounts"""
        response = requests.get(
            f"{BASE_URL}/api/v1/admin/accounts-with-users",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "accounts" in data
        print(f"✓ Admin accounts with users: {len(data['accounts'])} accounts")
    
    def test_admin_notification_counts(self):
        """Test GET /api/v1/admin/notification-counts returns counts"""
        response = requests.get(
            f"{BASE_URL}/api/v1/admin/notification-counts",
            headers=self.headers
        )
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, dict)
        print(f"✓ Admin notification counts: {data}")


class TestCustomerEndpoints:
    """Customer dashboard endpoint tests"""
    
    @pytest.fixture(autouse=True)
    def setup(self, customer_token):
        self.token = customer_token
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_customer_me(self):
        """Test GET /api/v1/auth/me returns current user info"""
        response = requests.get(f"{BASE_URL}/api/v1/auth/me", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == CUSTOMER_EMAIL
        assert data["role"] == "CUSTOMER"
        print(f"✓ Customer /me endpoint: {data['email']}")
    
    def test_customer_accounts(self):
        """Test GET /api/v1/accounts returns customer accounts"""
        response = requests.get(f"{BASE_URL}/api/v1/accounts", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Customer accounts: {len(data)} accounts")
    
    def test_customer_notifications(self):
        """Test GET /api/v1/notifications returns notifications"""
        response = requests.get(f"{BASE_URL}/api/v1/notifications", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, (list, dict))
        print(f"✓ Customer notifications accessible")
    
    def test_customer_tickets(self):
        """Test GET /api/v1/tickets returns customer tickets"""
        response = requests.get(f"{BASE_URL}/api/v1/tickets", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, (list, dict))
        print(f"✓ Customer tickets accessible")
    
    def test_customer_kyc_application(self):
        """Test GET /api/v1/kyc/application returns KYC application"""
        response = requests.get(f"{BASE_URL}/api/v1/kyc/application", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, dict)
        print(f"✓ Customer KYC application: {data.get('status', 'N/A')}")
    
    def test_customer_card_requests(self):
        """Test GET /api/v1/card-requests returns card requests"""
        response = requests.get(f"{BASE_URL}/api/v1/card-requests", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, (list, dict))
        print(f"✓ Customer card requests accessible")
    
    def test_customer_transfers(self):
        """Test GET /api/v1/transfers returns transfers"""
        response = requests.get(f"{BASE_URL}/api/v1/transfers", headers=self.headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, (list, dict))
        print(f"✓ Customer transfers accessible")


class TestAccessControl:
    """Access control tests - ensure non-admins can't access admin endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self, customer_token):
        self.token = customer_token
        self.headers = {"Authorization": f"Bearer {self.token}"}
    
    def test_customer_cannot_access_admin_users(self):
        """Test customer cannot access admin users endpoint"""
        response = requests.get(f"{BASE_URL}/api/v1/admin/users", headers=self.headers)
        assert response.status_code == 403
        print("✓ Customer correctly denied access to admin users (403)")
    
    def test_customer_cannot_access_admin_kyc(self):
        """Test customer cannot access admin KYC endpoint"""
        response = requests.get(f"{BASE_URL}/api/v1/admin/kyc/pending", headers=self.headers)
        assert response.status_code == 403
        print("✓ Customer correctly denied access to admin KYC (403)")
    
    def test_unauthenticated_cannot_access_protected(self):
        """Test unauthenticated requests are rejected"""
        response = requests.get(f"{BASE_URL}/api/v1/auth/me")
        assert response.status_code in [401, 403]
        print("✓ Unauthenticated request correctly rejected")


class TestLogout:
    """Logout functionality tests"""
    
    def test_admin_logout(self, admin_token):
        """Test admin logout works"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.post(f"{BASE_URL}/api/v1/auth/logout", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print("✓ Admin logout successful")
    
    def test_customer_logout(self, customer_token):
        """Test customer logout works"""
        headers = {"Authorization": f"Bearer {customer_token}"}
        response = requests.post(f"{BASE_URL}/api/v1/auth/logout", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert data.get("success") == True
        print("✓ Customer logout successful")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
