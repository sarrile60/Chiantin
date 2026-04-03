"""
Test Admin Edit User Profile Endpoint
Tests for PATCH /api/v1/admin/users/{user_id}/profile

Features tested:
- Admin can update first_name, last_name, email, phone
- Returns 400 if email is already taken by another user
- Returns 400 if no fields provided
- Returns 404 if user not found
- Only admins can access the endpoint (non-admin gets 403)
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_EMAIL = "admin@ecommbx.io"
ADMIN_PASSWORD = "Admin@123456"
TEST_USER_EMAIL = "testuser@chiantin.eu"
TEST_USER_PASSWORD = "Test@123456"


class TestAdminEditProfile:
    """Tests for admin editing user profile"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup test fixtures"""
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        
    def get_admin_token(self):
        """Get admin authentication token"""
        response = self.session.post(f"{BASE_URL}/api/v1/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip(f"Admin login failed: {response.status_code} - {response.text}")
        
    def get_customer_token(self):
        """Get customer authentication token"""
        response = self.session.post(f"{BASE_URL}/api/v1/auth/login", json={
            "email": TEST_USER_EMAIL,
            "password": TEST_USER_PASSWORD
        })
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip(f"Customer login failed: {response.status_code} - {response.text}")
        
    def get_test_user_id(self, admin_token):
        """Get the test user's ID"""
        self.session.headers.update({"Authorization": f"Bearer {admin_token}"})
        response = self.session.get(f"{BASE_URL}/api/v1/admin/users", params={"search": TEST_USER_EMAIL})
        if response.status_code == 200:
            users = response.json().get("users", [])
            for user in users:
                if user.get("email") == TEST_USER_EMAIL:
                    return user.get("id")
        pytest.skip(f"Could not find test user: {response.status_code}")
        
    def test_admin_can_update_first_name(self):
        """Test admin can update user's first name"""
        admin_token = self.get_admin_token()
        user_id = self.get_test_user_id(admin_token)
        
        self.session.headers.update({"Authorization": f"Bearer {admin_token}"})
        
        # Update first name
        response = self.session.patch(
            f"{BASE_URL}/api/v1/admin/users/{user_id}/profile",
            json={"first_name": "TestFirstName"}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data.get("success") == True
        assert "updated" in data.get("message", "").lower()
        
        # Verify the change persisted
        get_response = self.session.get(f"{BASE_URL}/api/v1/admin/users/{user_id}")
        assert get_response.status_code == 200
        user_data = get_response.json().get("user", {})
        assert user_data.get("first_name") == "TestFirstName"
        print("PASS: Admin can update first_name")
        
    def test_admin_can_update_last_name(self):
        """Test admin can update user's last name"""
        admin_token = self.get_admin_token()
        user_id = self.get_test_user_id(admin_token)
        
        self.session.headers.update({"Authorization": f"Bearer {admin_token}"})
        
        # Update last name
        response = self.session.patch(
            f"{BASE_URL}/api/v1/admin/users/{user_id}/profile",
            json={"last_name": "TestLastName"}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data.get("success") == True
        
        # Verify the change persisted
        get_response = self.session.get(f"{BASE_URL}/api/v1/admin/users/{user_id}")
        assert get_response.status_code == 200
        user_data = get_response.json().get("user", {})
        assert user_data.get("last_name") == "TestLastName"
        print("PASS: Admin can update last_name")
        
    def test_admin_can_update_phone(self):
        """Test admin can update user's phone number"""
        admin_token = self.get_admin_token()
        user_id = self.get_test_user_id(admin_token)
        
        self.session.headers.update({"Authorization": f"Bearer {admin_token}"})
        
        # Update phone
        response = self.session.patch(
            f"{BASE_URL}/api/v1/admin/users/{user_id}/profile",
            json={"phone": "+39123456789"}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data.get("success") == True
        
        # Verify the change persisted
        get_response = self.session.get(f"{BASE_URL}/api/v1/admin/users/{user_id}")
        assert get_response.status_code == 200
        user_data = get_response.json().get("user", {})
        assert user_data.get("phone") == "+39123456789"
        print("PASS: Admin can update phone")
        
    def test_admin_can_update_multiple_fields(self):
        """Test admin can update multiple fields at once"""
        admin_token = self.get_admin_token()
        user_id = self.get_test_user_id(admin_token)
        
        self.session.headers.update({"Authorization": f"Bearer {admin_token}"})
        
        # Update multiple fields
        response = self.session.patch(
            f"{BASE_URL}/api/v1/admin/users/{user_id}/profile",
            json={
                "first_name": "Giovanni",
                "last_name": "Rossi",
                "phone": "+39987654321"
            }
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data.get("success") == True
        
        # Verify all changes persisted
        get_response = self.session.get(f"{BASE_URL}/api/v1/admin/users/{user_id}")
        assert get_response.status_code == 200
        user_data = get_response.json().get("user", {})
        assert user_data.get("first_name") == "Giovanni"
        assert user_data.get("last_name") == "Rossi"
        assert user_data.get("phone") == "+39987654321"
        print("PASS: Admin can update multiple fields at once")
        
    def test_returns_400_if_no_fields_provided(self):
        """Test returns 400 if no fields are provided"""
        admin_token = self.get_admin_token()
        user_id = self.get_test_user_id(admin_token)
        
        self.session.headers.update({"Authorization": f"Bearer {admin_token}"})
        
        # Send empty update
        response = self.session.patch(
            f"{BASE_URL}/api/v1/admin/users/{user_id}/profile",
            json={}
        )
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}: {response.text}"
        data = response.json()
        assert "no fields" in data.get("detail", "").lower() or "update" in data.get("detail", "").lower()
        print("PASS: Returns 400 if no fields provided")
        
    def test_returns_400_if_email_already_taken(self):
        """Test returns 400 if email is already taken by another user"""
        admin_token = self.get_admin_token()
        user_id = self.get_test_user_id(admin_token)
        
        self.session.headers.update({"Authorization": f"Bearer {admin_token}"})
        
        # Try to update email to admin's email (which is taken)
        response = self.session.patch(
            f"{BASE_URL}/api/v1/admin/users/{user_id}/profile",
            json={"email": ADMIN_EMAIL}
        )
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}: {response.text}"
        data = response.json()
        assert "email" in data.get("detail", "").lower() and ("taken" in data.get("detail", "").lower() or "use" in data.get("detail", "").lower())
        print("PASS: Returns 400 if email is already taken")
        
    def test_returns_404_if_user_not_found(self):
        """Test returns 404 if user does not exist"""
        admin_token = self.get_admin_token()
        
        self.session.headers.update({"Authorization": f"Bearer {admin_token}"})
        
        # Try to update non-existent user
        response = self.session.patch(
            f"{BASE_URL}/api/v1/admin/users/nonexistent_user_id_12345/profile",
            json={"first_name": "Test"}
        )
        
        assert response.status_code == 404, f"Expected 404, got {response.status_code}: {response.text}"
        print("PASS: Returns 404 if user not found")
        
    def test_non_admin_cannot_access_endpoint(self):
        """Test that non-admin users get 403 when trying to access the endpoint"""
        # Get customer token
        customer_token = self.get_customer_token()
        admin_token = self.get_admin_token()
        user_id = self.get_test_user_id(admin_token)
        
        # Try to access with customer token
        self.session.headers.update({"Authorization": f"Bearer {customer_token}"})
        
        response = self.session.patch(
            f"{BASE_URL}/api/v1/admin/users/{user_id}/profile",
            json={"first_name": "Hacker"}
        )
        
        # Should be 403 Forbidden (or 401 if token is invalid for admin routes)
        assert response.status_code in [401, 403], f"Expected 401 or 403, got {response.status_code}: {response.text}"
        print("PASS: Non-admin cannot access endpoint")
        
    def test_admin_can_update_email_to_new_unique_email(self):
        """Test admin can update user's email to a new unique email"""
        admin_token = self.get_admin_token()
        user_id = self.get_test_user_id(admin_token)
        
        self.session.headers.update({"Authorization": f"Bearer {admin_token}"})
        
        # Update email to a new unique email
        new_email = "testuser_updated@chiantin.eu"
        response = self.session.patch(
            f"{BASE_URL}/api/v1/admin/users/{user_id}/profile",
            json={"email": new_email}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data.get("success") == True
        
        # Verify the change persisted
        get_response = self.session.get(f"{BASE_URL}/api/v1/admin/users/{user_id}")
        assert get_response.status_code == 200
        user_data = get_response.json().get("user", {})
        assert user_data.get("email") == new_email.lower()
        
        # Revert back to original email
        revert_response = self.session.patch(
            f"{BASE_URL}/api/v1/admin/users/{user_id}/profile",
            json={"email": TEST_USER_EMAIL}
        )
        assert revert_response.status_code == 200
        print("PASS: Admin can update email to new unique email")
        
    def test_email_is_normalized_to_lowercase(self):
        """Test that email is normalized to lowercase"""
        admin_token = self.get_admin_token()
        user_id = self.get_test_user_id(admin_token)
        
        self.session.headers.update({"Authorization": f"Bearer {admin_token}"})
        
        # Update email with mixed case
        response = self.session.patch(
            f"{BASE_URL}/api/v1/admin/users/{user_id}/profile",
            json={"email": "TestUser@Chiantin.EU"}
        )
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        
        # Verify email is lowercase
        get_response = self.session.get(f"{BASE_URL}/api/v1/admin/users/{user_id}")
        assert get_response.status_code == 200
        user_data = get_response.json().get("user", {})
        assert user_data.get("email") == "testuser@chiantin.eu"
        print("PASS: Email is normalized to lowercase")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
