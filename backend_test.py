"""
Backend API Testing for ECOMMBX Banking Application
Tests admin and user login, notification bell endpoints, and key features
"""

import requests
import sys
from datetime import datetime

# Backend URL from environment
BASE_URL = "https://ecomm-bank.preview.emergentagent.com/api/v1"
HEALTH_URL = "https://ecomm-bank.preview.emergentagent.com/api/health"

# Credentials from review request
ADMIN_EMAIL = "admin@ecommbx.io"
ADMIN_PASSWORD = "Admin@123456"
USER_EMAIL = "ashleyalt003@gmail.com"
USER_PASSWORD = "TestPassword123!"


class APITester:
    def __init__(self):
        self.tests_run = 0
        self.tests_passed = 0
        self.tests_failed = 0
        self.errors = []
        self.admin_token = None
        self.user_token = None
        self.admin_user = None
        self.user_user = None

    def log_test(self, name, success, message=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            self.tests_failed += 1
            self.errors.append({"test": name, "error": message})
            print(f"❌ {name}: {message}")

    def test_health_check(self):
        """Test health check endpoint"""
        try:
            response = requests.get(HEALTH_URL, timeout=10)
            if response.status_code == 200:
                self.log_test("Health Check", True)
                return True
            else:
                self.log_test("Health Check", False, f"Status {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Health Check", False, str(e))
            return False

    def test_admin_login(self):
        """Test admin login with admin@ecommbx.io"""
        try:
            response = requests.post(
                f"{BASE_URL}/auth/login",
                json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.admin_token = data["access_token"]
                    self.admin_user = data["user"]
                    self.log_test("Admin Login", True)
                    return True
                else:
                    self.log_test("Admin Login", False, "Missing token or user in response")
                    return False
            else:
                self.log_test("Admin Login", False, f"Status {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("Admin Login", False, str(e))
            return False

    def test_user_login(self):
        """Test user login with ashleyalt003@gmail.com"""
        try:
            response = requests.post(
                f"{BASE_URL}/auth/login",
                json={"email": USER_EMAIL, "password": USER_PASSWORD},
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data and "user" in data:
                    self.user_token = data["access_token"]
                    self.user_user = data["user"]
                    self.log_test("User Login", True)
                    return True
                else:
                    self.log_test("User Login", False, "Missing token or user in response")
                    return False
            else:
                self.log_test("User Login", False, f"Status {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("User Login", False, str(e))
            return False

    def test_admin_users_list(self):
        """Test admin users list endpoint"""
        if not self.admin_token:
            self.log_test("Admin Users List", False, "No admin token")
            return False
        
        try:
            response = requests.get(
                f"{BASE_URL}/admin/users",
                headers={"Authorization": f"Bearer {self.admin_token}"},
                timeout=10
            )
            if response.status_code == 200:
                users = response.json()
                if isinstance(users, list):
                    user_count = len(users)
                    self.log_test(f"Admin Users List ({user_count} users)", True)
                    return True
                else:
                    self.log_test("Admin Users List", False, "Response is not a list")
                    return False
            else:
                self.log_test("Admin Users List", False, f"Status {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Admin Users List", False, str(e))
            return False

    def test_admin_accounts_list(self):
        """Test admin accounts list endpoint"""
        if not self.admin_token:
            self.log_test("Admin Accounts List", False, "No admin token")
            return False
        
        try:
            response = requests.get(
                f"{BASE_URL}/admin/accounts-with-users",
                headers={"Authorization": f"Bearer {self.admin_token}"},
                timeout=10
            )
            if response.status_code == 200:
                accounts = response.json()
                if isinstance(accounts, list):
                    account_count = len(accounts)
                    self.log_test(f"Admin Accounts List ({account_count} accounts)", True)
                    return True
                else:
                    self.log_test("Admin Accounts List", False, "Response is not a list")
                    return False
            else:
                self.log_test("Admin Accounts List", False, f"Status {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Admin Accounts List", False, str(e))
            return False

    def test_admin_kyc_pending(self):
        """Test admin KYC pending endpoint (for notification bell)"""
        if not self.admin_token:
            self.log_test("Admin KYC Pending", False, "No admin token")
            return False
        
        try:
            response = requests.get(
                f"{BASE_URL}/admin/kyc/pending",
                headers={"Authorization": f"Bearer {self.admin_token}"},
                timeout=10
            )
            if response.status_code == 200:
                kyc_list = response.json()
                if isinstance(kyc_list, list):
                    kyc_count = len(kyc_list)
                    self.log_test(f"Admin KYC Pending ({kyc_count} pending)", True)
                    return True
                else:
                    self.log_test("Admin KYC Pending", False, "Response is not a list")
                    return False
            else:
                self.log_test("Admin KYC Pending", False, f"Status {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Admin KYC Pending", False, str(e))
            return False

    def test_admin_card_requests(self):
        """Test admin card requests endpoint (for notification bell)"""
        if not self.admin_token:
            self.log_test("Admin Card Requests", False, "No admin token")
            return False
        
        try:
            response = requests.get(
                f"{BASE_URL}/admin/card-requests",
                headers={"Authorization": f"Bearer {self.admin_token}"},
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                if "data" in data and isinstance(data["data"], list):
                    card_count = len(data["data"])
                    self.log_test(f"Admin Card Requests ({card_count} requests)", True)
                    return True
                else:
                    self.log_test("Admin Card Requests", False, "Invalid response format")
                    return False
            else:
                self.log_test("Admin Card Requests", False, f"Status {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Admin Card Requests", False, str(e))
            return False

    def test_admin_transfers_queue(self):
        """Test admin transfers queue endpoint (for notification bell)"""
        if not self.admin_token:
            self.log_test("Admin Transfers Queue", False, "No admin token")
            return False
        
        try:
            response = requests.get(
                f"{BASE_URL}/admin/transfers?status=SUBMITTED",
                headers={"Authorization": f"Bearer {self.admin_token}"},
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                if "data" in data and isinstance(data["data"], list):
                    transfer_count = len(data["data"])
                    self.log_test(f"Admin Transfers Queue ({transfer_count} pending)", True)
                    return True
                else:
                    self.log_test("Admin Transfers Queue", False, "Invalid response format")
                    return False
            else:
                self.log_test("Admin Transfers Queue", False, f"Status {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Admin Transfers Queue", False, str(e))
            return False

    def test_admin_support_tickets(self):
        """Test admin support tickets endpoint (for notification bell)"""
        if not self.admin_token:
            self.log_test("Admin Support Tickets", False, "No admin token")
            return False
        
        try:
            response = requests.get(
                f"{BASE_URL}/admin/tickets?status=OPEN",
                headers={"Authorization": f"Bearer {self.admin_token}"},
                timeout=10
            )
            if response.status_code == 200:
                tickets = response.json()
                if isinstance(tickets, list):
                    ticket_count = len(tickets)
                    self.log_test(f"Admin Support Tickets ({ticket_count} open)", True)
                    return True
                else:
                    self.log_test("Admin Support Tickets", False, "Response is not a list")
                    return False
            else:
                self.log_test("Admin Support Tickets", False, f"Status {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Admin Support Tickets", False, str(e))
            return False

    def test_admin_analytics_overview(self):
        """Test admin analytics overview endpoint"""
        if not self.admin_token:
            self.log_test("Admin Analytics Overview", False, "No admin token")
            return False
        
        try:
            response = requests.get(
                f"{BASE_URL}/admin/analytics/overview",
                headers={"Authorization": f"Bearer {self.admin_token}"},
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                # Verify expected structure
                required_keys = ["users", "kyc", "accounts", "transfers", "tickets", "cards"]
                missing_keys = [key for key in required_keys if key not in data]
                if missing_keys:
                    self.log_test("Admin Analytics Overview", False, f"Missing keys: {missing_keys}")
                    return False
                
                # Verify nested structure
                if "total" not in data["users"] or "active" not in data["users"]:
                    self.log_test("Admin Analytics Overview", False, "Invalid users structure")
                    return False
                
                self.log_test("Admin Analytics Overview", True)
                return True
            else:
                self.log_test("Admin Analytics Overview", False, f"Status {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Admin Analytics Overview", False, str(e))
            return False

    def test_admin_rejected_transfers(self):
        """Test admin rejected transfers endpoint (verify rejection reason is returned)"""
        if not self.admin_token:
            self.log_test("Admin Rejected Transfers", False, "No admin token")
            return False
        
        try:
            response = requests.get(
                f"{BASE_URL}/admin/transfers?status=REJECTED",
                headers={"Authorization": f"Bearer {self.admin_token}"},
                timeout=10
            )
            if response.status_code == 200:
                data = response.json()
                if "data" in data and isinstance(data["data"], list):
                    rejected_count = len(data["data"])
                    # Check if any rejected transfer has reject_reason field
                    has_reason_field = False
                    if rejected_count > 0:
                        for transfer in data["data"]:
                            if "reject_reason" in transfer:
                                has_reason_field = True
                                break
                    
                    if rejected_count > 0 and not has_reason_field:
                        self.log_test(f"Admin Rejected Transfers ({rejected_count} rejected)", False, 
                                    "reject_reason field missing in rejected transfers")
                        return False
                    
                    self.log_test(f"Admin Rejected Transfers ({rejected_count} rejected)", True)
                    return True
                else:
                    self.log_test("Admin Rejected Transfers", False, "Invalid response format")
                    return False
            else:
                self.log_test("Admin Rejected Transfers", False, f"Status {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Admin Rejected Transfers", False, str(e))
            return False

    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {self.tests_failed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.errors:
            print("\n" + "=" * 60)
            print("FAILED TESTS:")
            print("=" * 60)
            for error in self.errors:
                print(f"❌ {error['test']}: {error['error']}")
        
        print("=" * 60)


def main():
    """Run all backend tests"""
    print("=" * 60)
    print("ECOMMBX BANKING - BACKEND API TESTS")
    print("=" * 60)
    print(f"Backend URL: {BASE_URL}")
    print(f"Testing Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    print()

    tester = APITester()

    # Run tests in order
    print("🔍 Testing Basic Connectivity...")
    tester.test_health_check()
    print()

    print("🔐 Testing Authentication...")
    admin_login_success = tester.test_admin_login()
    user_login_success = tester.test_user_login()
    print()

    if admin_login_success:
        print("👥 Testing Admin Endpoints...")
        tester.test_admin_users_list()
        tester.test_admin_accounts_list()
        print()

        print("📊 Testing Analytics Endpoint...")
        tester.test_admin_analytics_overview()
        print()

        print("🔔 Testing Notification Bell Endpoints...")
        tester.test_admin_kyc_pending()
        tester.test_admin_card_requests()
        tester.test_admin_transfers_queue()
        tester.test_admin_support_tickets()
        print()

        print("💸 Testing Transfers Endpoints...")
        tester.test_admin_rejected_transfers()
        print()
    else:
        print("⚠️  Skipping admin tests due to login failure")
        print()

    # Print summary
    tester.print_summary()

    # Return exit code
    return 0 if tester.tests_failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
