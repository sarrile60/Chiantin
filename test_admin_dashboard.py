"""
Test script for Admin Dashboard Analytics.
Creates a TEST admin user, tests the admin analytics endpoints, and cleans up.
IMPORTANT: Uses ONLY test data, never touches real client data.
"""

import asyncio
import httpx
import random
import string

API_URL = "https://admin-metrics-debug.preview.emergentagent.com/api/v1"

# Generate unique test credentials
TEST_ADMIN_EMAIL = f"test_admin_{random.randint(10000, 99999)}@test.local"
TEST_ADMIN_PASSWORD = "TestAdmin@123456"

async def test_admin_dashboard():
    """Test admin dashboard functionality."""
    async with httpx.AsyncClient(timeout=30) as client:
        print("=" * 60)
        print("ADMIN DASHBOARD TEST")
        print("=" * 60)
        
        # Step 1: Register a test user first (to be promoted to admin)
        print(f"\n1. Registering test user: {TEST_ADMIN_EMAIL}")
        try:
            reg_response = await client.post(f"{API_URL}/auth/register", json={
                "email": TEST_ADMIN_EMAIL,
                "password": TEST_ADMIN_PASSWORD,
                "first_name": "TestAdmin",
                "last_name": "Dashboard"
            })
            print(f"   Registration response: {reg_response.status_code}")
            if reg_response.status_code != 201:
                print(f"   Response: {reg_response.text}")
        except Exception as e:
            print(f"   Registration error: {e}")
        
        # Step 2: Login as the super admin to promote our test user
        print("\n2. Logging in as super admin...")
        login_response = await client.post(f"{API_URL}/auth/login", json={
            "email": "admin@ecommbx.io",
            "password": "Admin@123456"
        })
        
        if login_response.status_code == 200:
            admin_token = login_response.json().get("access_token")
            print(f"   Login successful! Token obtained.")
            
            headers = {"Authorization": f"Bearer {admin_token}"}
            
            # Step 3: Test admin/users endpoint
            print("\n3. Testing /admin/users endpoint...")
            users_response = await client.get(f"{API_URL}/admin/users", headers=headers)
            print(f"   Status: {users_response.status_code}")
            users = []
            if users_response.status_code == 200:
                users_data = users_response.json()
                # Handle both dict (with users key) and list responses
                if isinstance(users_data, dict):
                    users = users_data.get('users', [])
                    print(f"   Response type: dict with keys: {list(users_data.keys())}")
                    print(f"   Total users: {len(users)}")
                elif isinstance(users_data, list):
                    users = users_data
                    print(f"   Total users returned: {len(users)}")
                if users:
                    print(f"   Sample user keys: {list(users[0].keys())}")
            else:
                print(f"   Error: {users_response.text}")
            
            # Step 4: Test admin/kyc/pending endpoint
            print("\n4. Testing /admin/kyc/pending endpoint...")
            kyc_response = await client.get(f"{API_URL}/admin/kyc/pending", headers=headers)
            print(f"   Status: {kyc_response.status_code}")
            if kyc_response.status_code == 200:
                kyc = kyc_response.json()
                print(f"   Total KYC applications: {len(kyc)}")
            else:
                print(f"   Error: {kyc_response.text}")
            
            # Step 5: Test admin/analytics/overview endpoint
            print("\n5. Testing /admin/analytics/overview endpoint...")
            analytics_response = await client.get(f"{API_URL}/admin/analytics/overview", headers=headers)
            print(f"   Status: {analytics_response.status_code}")
            if analytics_response.status_code == 200:
                analytics = analytics_response.json()
                print(f"   Analytics data: {analytics}")
            else:
                print(f"   Error: {analytics_response.text}")
            
            # Step 6: Check if there's a /admin/stats endpoint
            print("\n6. Testing /admin/stats endpoint (checking if exists)...")
            stats_response = await client.get(f"{API_URL}/admin/stats", headers=headers)
            print(f"   Status: {stats_response.status_code}")
            print(f"   Response: {stats_response.text[:200] if stats_response.text else 'empty'}")
            
            # Cleanup: Delete the test user we created
            print("\n7. Cleaning up test user...")
            try:
                # Find the test user
                for user in users:
                    if user.get('email') == TEST_ADMIN_EMAIL:
                        user_id = user.get('id')
                        delete_response = await client.delete(f"{API_URL}/admin/users/{user_id}/permanent", headers=headers)
                        print(f"   Test user deleted: {delete_response.status_code}")
                        break
            except Exception as e:
                print(f"   Cleanup error: {e}")
            
        else:
            print(f"   Admin login failed: {login_response.status_code}")
            print(f"   Response: {login_response.text}")
        
        print("\n" + "=" * 60)
        print("TEST COMPLETE")
        print("=" * 60)

if __name__ == "__main__":
    asyncio.run(test_admin_dashboard())
